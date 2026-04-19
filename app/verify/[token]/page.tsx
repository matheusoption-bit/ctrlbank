import { verifyArtifactByToken } from "@/lib/artifacts/service";

export default async function VerifyArtifactPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await verifyArtifactByToken(token);

  const metadata = (result.artifact?.metadata as Record<string, unknown> | null) ?? null;

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-black tracking-tight">Verificação de artefato</h1>
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
        <p><strong>Status:</strong> {result.status}</p>
        <p><strong>Tipo:</strong> {result.artifact?.artifactType ?? "-"}</p>
        <p><strong>Criado em:</strong> {result.artifact?.createdAt ? new Date(result.artifact.createdAt).toLocaleString("pt-BR") : "-"}</p>
        <p><strong>Chave:</strong> {result.artifact?.signatureKeyId ?? "-"}</p>
        <p><strong>Período:</strong> {String(metadata?.period ?? "-")}</p>
      </div>
      <p className="text-sm text-secondary">Esta página confirma autenticidade e integridade do artefato sem expor conteúdo financeiro sensível.</p>
    </div>
  );
}
