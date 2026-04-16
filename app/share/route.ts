import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processAiIngest } from "@/lib/ai/ingest";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  
  if (!user) {
    // Se não estiver logado, redireciona para login
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const text = formData.get("text")?.toString() || "";
    const urlStr = formData.get("url")?.toString() || "";
    const file = formData.get("image") as File | null;

    let content = [title, text, urlStr].filter(Boolean).join(" ");
    let inputType: "text" | "image" | "text+image" | "pdf" | "csv" = "text";
    let imageBase64: string | undefined;
    let mimeType: string | undefined;

    if (file && file.size > 0) {
      if (file.type === "application/pdf") {
         inputType = "pdf";
      } else if (file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
         inputType = "csv";
         const bytes = await file.arrayBuffer();
         content = new TextDecoder("utf-8").decode(bytes); // For CSV, just put in content
      } else if (file.type.startsWith("image/")) {
         inputType = content ? "text+image" : "image";
      }

      if (inputType !== "csv") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageBase64 = buffer.toString("base64");
        mimeType = file.type;
      }
    }

    let captureGroupId: string | null = null;

    if (content || imageBase64) {
      const result = await processAiIngest({
        userId: user.id,
        householdId: dbUser?.householdId ?? null,
        mode: "Registrar",
        inputType,
        content: content || undefined,
        imageBase64,
        mimeType,
      });

      captureGroupId = result.captureGroupId;
    }

    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("shared", "success");
    if (captureGroupId) {
      redirectUrl.searchParams.set("captureGroupId", captureGroupId);
    }
    return NextResponse.redirect(redirectUrl);

  } catch (err: any) {
    console.error("[share-target] Erro:", err);
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("share_error", "1");
    return NextResponse.redirect(redirectUrl);
  }
}
