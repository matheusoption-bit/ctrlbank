import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { createTransactionBatch } from "@/app/actions/transactions";
import { normalizeInboxItems } from "@/lib/finance/normalize";
import { ParsedInboxItem } from "@/lib/inbox/parser";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const items = Array.isArray(body?.items) ? (body.items as ParsedInboxItem[]) : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Nenhuma transação para confirmar." }, { status: 400 });
    }

    const normalized = normalizeInboxItems(items);
    if (normalized.length === 0) {
      return NextResponse.json({ error: "Nenhuma transação válida para salvar." }, { status: 400 });
    }

    const result = await createTransactionBatch(normalized);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      saved: result.saved ?? 0,
      message: `Confirmei ${result.saved ?? 0} transação(ões).`,
    });
  } catch (error) {
    console.error("[api/inbox/confirm] erro:", error);
    return NextResponse.json({ error: "Não foi possível confirmar agora." }, { status: 500 });
  }
}
