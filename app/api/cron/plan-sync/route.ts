import { NextRequest, NextResponse } from "next/server";
import { syncAllActivePlans } from "@/lib/ai/planner";

async function handleSync(req: NextRequest) {
  // Authentication check for cron endpoints
  const authHeader = req.headers.get("authorization");

  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET não configurado" }, { status: 503 });
  }

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await syncAllActivePlans();
    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("[cron/plan-sync] Error running plan sync", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}
