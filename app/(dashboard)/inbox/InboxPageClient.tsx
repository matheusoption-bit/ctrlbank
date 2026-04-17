"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DraftLike = {
  description?: string;
  amount?: number;
  categoryName?: string;
};

type InboxEvent = {
  id: string;
  source: string;
  inputType: string;
  createdAt: string;
  decision: string;
  captureGroupId: string | null;
  createdTransactionId: string | null;
  normalizedDraft: DraftLike | null;
};

type BatchResult = {
  batchId: string;
  processed: number;
  possibleDuplicates: number;
  readyToSave: number;
  conflicts: number;
  message: string;
};

type Props = {
  events: InboxEvent[];
};

function sourceBadge(channel: string, inputType: string) {
  if (inputType === "ofx") return "via OFX";
  if (inputType === "csv") return "via CSV";
  if (inputType === "pdf") return "via PDF";
  if (inputType === "image") return "via OCR";
  if (channel === "whatsapp") return "via WhatsApp";
  if (channel === "email") return "via Email";
  if (channel === "import") return "via Importação";
  return "Inclusão Manual";
}

export default function InboxPageClient({ events }: Props) {
  const router = useRouter();
  const [rawInput, setRawInput] = useState("");
  const [documentKind, setDocumentKind] = useState("unknown");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);

  const hasEvents = useMemo(() => events.length > 0, [events]);
  const byDecision = useMemo(() => {
    return {
      duplicates: events.filter((event) => event.decision === "possible_duplicate").length,
      review: events.filter((event) => event.decision === "transaction_draft" || event.decision === "batch_review").length,
      saved: events.filter((event) => Boolean(event.createdTransactionId)).length,
    };
  }, [events]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }
      if (rawInput.trim()) formData.append("rawInput", rawInput.trim());
      formData.append("documentKind", documentKind);
      formData.append("channel", files.length > 0 ? "import" : "manual");

      const response = await fetch("/api/inbox/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao processar lote na Inbox");
      }

      setBatchResult({
        batchId: data.batchId,
        processed: data.processed,
        possibleDuplicates: data.possibleDuplicates,
        readyToSave: data.readyToSave,
        conflicts: data.conflicts,
        message: data.message,
      });

      setMessage(data?.message || "Lote processado com sucesso.");
      setRawInput("");
      setFiles([]);
      router.refresh();
    } catch (error: any) {
      setMessage(error?.message || "Falha ao processar entrada");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Captura inteligente</h2>
            <p className="text-sm text-secondary">Envie texto, áudio, imagem, PDF, CSV ou OFX. O CtrlBank classifica e decide o fluxo.</p>
          </div>
          <Link href="/processamentos" className="text-sm font-semibold text-primary hover:underline">
            Ver histórico operacional
          </Link>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Arquivos (multi-upload)</label>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,application/pdf,text/csv,.csv,.ofx,application/x-ofx"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
            />
            {files.length > 0 && (
              <p className="text-xs text-secondary">{files.length} arquivo(s) selecionado(s).</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Texto complementar (opcional)</label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
              placeholder="Se quiser, descreva o contexto do envio"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tipo (opcional)</label>
            <select
              value={documentKind}
              onChange={(e) => setDocumentKind(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
            >
              <option value="unknown">Automático</option>
              <option value="statement">Extrato</option>
              <option value="invoice">Fatura</option>
              <option value="receipt">Comprovante</option>
            </select>
          </div>

          <button
            disabled={loading || (files.length === 0 && !rawInput.trim())}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Processando lote..." : "Enviar para captura"}
          </button>
        </form>

        {message && <p className="text-sm text-secondary">{message}</p>}

        {batchResult && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="rounded-xl bg-surface-2 border border-border p-3"><p className="text-secondary text-xs">Processados</p><p className="font-bold">{batchResult.processed}</p></div>
            <div className="rounded-xl bg-surface-2 border border-border p-3"><p className="text-secondary text-xs">Possíveis duplicidades</p><p className="font-bold">{batchResult.possibleDuplicates}</p></div>
            <div className="rounded-xl bg-surface-2 border border-border p-3"><p className="text-secondary text-xs">Prontos para salvar</p><p className="font-bold">{batchResult.readyToSave}</p></div>
            <div className="rounded-xl bg-surface-2 border border-border p-3"><p className="text-secondary text-xs">Conflitos/erros</p><p className="font-bold">{batchResult.conflicts}</p></div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Fila operacional recente</h3>
          <p className="text-xs text-secondary">
            {byDecision.saved} salvos · {byDecision.review} em revisão · {byDecision.duplicates} possíveis duplicidades
          </p>
        </div>

        {hasEvents ? (
          <div className="space-y-3">
            {events.map((event) => {
              const badge = sourceBadge(event.source, event.inputType);
              const draft = event.normalizedDraft && typeof event.normalizedDraft === "object" ? event.normalizedDraft : null;
              const title = draft?.description || "Evidência processada";

              return (
                <article key={event.id} className="rounded-2xl border border-border bg-surface-2 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold truncate">{title}</p>
                    <span className="rounded-full bg-primary/15 text-primary text-xs font-bold px-2 py-1">{badge}</span>
                  </div>

                  <p className="text-sm text-secondary">
                    {draft?.amount ? `R$ ${Number(draft.amount).toFixed(2).replace(".", ",")}` : "Valor pendente"}
                    {draft?.categoryName ? ` · ${draft.categoryName}` : ""}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-secondary">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
                    <span className="text-[10px] uppercase tracking-wide text-secondary">{event.decision}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-secondary">Nenhum evento recente. Envie seu primeiro lote de evidências.</p>
        )}
      </section>
    </div>
  );
}
