"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getConversationHistory(limit = 20, cursor?: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const conversation = await prisma.aiConversation.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: { updatedAt: "desc" }
  });

  if (!conversation) return { messages: [], conversationId: null };

  const messages = await prisma.aiMessage.findMany({
    where: { conversationId: conversation.id },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" }
  });

  return {
    conversationId: conversation.id,
    messages: messages.reverse(),
    nextCursor: messages.length === limit ? messages[messages.length - 1].id : null
  };
}
