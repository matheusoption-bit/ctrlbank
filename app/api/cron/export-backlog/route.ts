import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Execute the export script
    const { stdout, stderr } = await execPromise("npm run backlog:export");
    
    if (stderr && !stdout) {
      console.error("Export backlog stderr:", stderr);
      return NextResponse.json({ error: "Failed to export backlog", details: stderr }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Backlog exported successfully", output: stdout });
  } catch (error: any) {
    console.error("Cron export-backlog error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
