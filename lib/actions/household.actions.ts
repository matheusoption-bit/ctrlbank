"use server";

import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

/**
 * Checks if the user is attached to a Household. If not, it creates a new one
 * based on the user's name or email and attaches the user to it.
 * This should be called during login or at the protected dashboard layout as a safety net.
 */
export async function initializeHousehold() {
  const { user } = await validateSession();
  
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Fetch the full user to check for householdId
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    return { success: false, error: "User not found" };
  }

  if (dbUser.householdId) {
    return { success: true, householdId: dbUser.householdId };
  }

  try {
    const existingHousehold = await prisma.household.findFirst({
      where: { users: { some: { id: dbUser.id } } }
    });

    if (existingHousehold) {
      if (!dbUser.householdId) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { householdId: existingHousehold.id }
        });
      }
      return { success: true, householdId: existingHousehold.id };
    }

    // User has no household, create one
    const householdName = `Família ${dbUser.name || dbUser.email.split("@")[0]}`;
    
    const newHousehold = await prisma.household.create({
      data: {
        name: householdName,
        users: {
          connect: { id: dbUser.id }
        }
      }
    });

    return { success: true, householdId: newHousehold.id };
  } catch (error) {
    console.error("Failed to initialize household:", error);
    return { success: false, error: "Failed to create household" };
  }
}
