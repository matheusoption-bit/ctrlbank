import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron Job endpoint: GET /api/cron/recurring
export async function GET(req: Request) {
  // Validate CRON_SECRET to prevent unauthorized trigger
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Buscar transações ativas com nextDate <= hoje
    const dueTransactions = await prisma.recurringTransaction.findMany({
      where: {
        active: true,
        nextDate: { lte: endOfDay },
        OR: [
          { endDate: null },
          { endDate: { gte: today } }
        ]
      }
    });

    if (dueTransactions.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No due transactions" });
    }

    let processedCount = 0;

    for (const tx of dueTransactions) {
      // Busca um usuário válido associado à contabancária para ser o autor da transação
      const targetAccount = await prisma.bankAccount.findUnique({
        where: { id: tx.bankAccountId },
        select: { userId: true }
      });

      if (!targetAccount) continue; // Pula se conta base não existir

      await prisma.transaction.create({
        data: {
          householdId: tx.householdId,
          userId: targetAccount.userId,
          bankAccountId: tx.bankAccountId,
          categoryId: tx.categoryId,
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          status: "PENDING", 
          date: tx.nextDate,
          notes: "Gerado automaticamente (Recorrente)"
        }
      });
      
      // Atualiza a próxima data
      let newNextDate = new Date(tx.nextDate);
      switch(tx.frequency) {
        case "DAILY": newNextDate.setDate(newNextDate.getDate() + 1); break;
        case "WEEKLY": newNextDate.setDate(newNextDate.getDate() + 7); break;
        case "BIWEEKLY": newNextDate.setDate(newNextDate.getDate() + 14); break;
        case "MONTHLY": newNextDate.setMonth(newNextDate.getMonth() + 1); break;
        case "QUARTERLY": newNextDate.setMonth(newNextDate.getMonth() + 3); break;
        case "YEARLY": newNextDate.setFullYear(newNextDate.getFullYear() + 1); break;
      }

      await prisma.recurringTransaction.update({
        where: { id: tx.id },
        data: { nextDate: newNextDate }
      });

      processedCount++;
    }

    return NextResponse.json({ success: true, count: processedCount });
  } catch (error: any) {
    console.error("Cron recurring error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
