import { NextRequest, NextResponse } from "next/server";
import { verifyArtifactByToken } from "@/lib/artifacts/service";

export async function GET(_: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await verifyArtifactByToken(token);

  return NextResponse.json({
    status: result.status,
    artifact: result.artifact
      ? {
          artifactType: result.artifact.artifactType,
          createdAt: result.artifact.createdAt,
          signatureKeyId: result.artifact.signatureKeyId,
          verificationToken: result.artifact.verificationToken,
          metadata: {
            period: (result.artifact.metadata as Record<string, unknown> | undefined)?.period ?? null,
            verificationUrl: (result.artifact.metadata as Record<string, unknown> | undefined)?.verificationUrl ?? null,
          },
        }
      : null,
  });
}
