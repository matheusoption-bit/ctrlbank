"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
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

type ParseResponse = {
  batchId: string;
  processed: number;
  possibleDuplicates: number;
  readyToSave: number;
  conflicts: number;
  message: string;
  detectedType: "bank_statement" | "receipt" | "invoice";
  source: "nubank" | "itau" | "unknown";
  items: Array<{
    index: number;
    fileName: string | null;
    status: "new" | "duplicate" | "review" | "error";
    message: string;
    eventId: string | null;
    existingId: string | null;
  }>;
};

type Props = {
  events: InboxEvent[];
  eventsLoadError?: string | null;
};

function sourceBadge(channel: string, inputType: string) {
  if (inputType === "ofx") return "via OFX";
  if (inputType === "csv") return "via CSV";
  if (inputType === "pdf") return "via PDF";
  if (inputType === "image") return "via OCR";
  if (inputType === "audio") return "via Áudio";
  if (channel === "whatsapp") return "via WhatsApp";
  if (channel === "email") return "via Email";
  if (channel === "import") return "via Importação";
  return "Inclusão Manual";
}

export default function InboxPageClient({ events, eventsLoadError }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawInput, setRawInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [batchResult, setBatchResult] = useState<ParseResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const hasEvents = useMemo(() => events.length > 0, [events]);
  const byDecision = useMemo(() => {
    return {
      duplicates: events.filter((event) => event.decision === "possible_duplicate").length,
      review: events.filter((event) => event.decision === "transaction_draft" || event.decision === "batch_review").length,
      saved: events.filter((event) => Boolean(event.createdTransactionId)).length,
    };
  }, [events]);

  const previewNames = useMemo(() => files.slice(0, 5).map((file) => file.name), [files]);

  function onAddFiles(nextFiles: FileList | File[] | null) {
    if (!nextFiles) return;
    setFiles((current) => [...current, ...Array.from(nextFiles)]);
  }

  async function sendForProcessing() {
    if (files.length === 0 && !rawInput.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }
      if (rawInput.trim()) formData.append("rawInput", rawInput.trim());
      formData.append("channel", files.length > 0 ? "import" : "manual");

      const response = await fetch("/api/inbox/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao processar lote na Inbox");
      }

      setBatchResult(data as ParseResponse);
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

  async function confirmBatch() {
    if (!batchResult) return;
    setConfirming(true);
    setMessage(null);

    try {
      const response = await fetch("/api/inbox/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batchResult.batchId,
          eventIds: batchResult.items.filter((item) => item.status === "new" || item.status === "review").map((item) => item.eventId),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao confirmar o lote");
      }

      setMessage(data?.message || "Lote confirmado com sucesso.");
      router.refresh();
    } catch (error: any) {
      setMessage(error?.message || "Não foi possível confirmar o lote.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Inbox V2 · Ingestão automática</h2>
            <p className="text-sm text-secondary">Você envia e o CtrlBank interpreta automaticamente. Sem formulário obrigatório.</p>
          </div>
          <Link href="/inbox/history" className="text-sm font-semibold text-primary hover:underline">
            Histórico de uploads
          </Link>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            onAddFiles(e.dataTransfer.files);
          }}
          className={`rounded-2xl border-2 border-dashed p-5 transition ${dragActive ? "border-primary bg-primary/5" : "border-border bg-surface-2"}`}
        >
          <p className="text-sm font-semibold">Arraste arquivos ou toque em Enviar</p>
          <p className="text-xs text-secondary mt-1">Suporta: imagem, PDF, CSV, OFX, texto e áudio.</p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            >
              Enviar
            </button>
            <button
              type="button"
              disabled={loading || (files.length === 0 && !rawInput.trim())}
              onClick={sendForProcessing}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Processando..." : "Executar ingestão"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,application/pdf,text/csv,.csv,.ofx,application/x-ofx,text/plain,.txt,audio/*"
            onChange={(e) => onAddFiles(e.target.files)}
            className="hidden"
          />

          {files.length > 0 && (
            <div className="mt-3 rounded-xl border border-border bg-surface p-3">
              <p className="text-xs font-semibold">{files.length} item(ns) pronto(s) para ingestão</p>
              <ul className="mt-2 space-y-1 text-xs text-secondary">
                {previewNames.map((name) => (
                  <li key={name}>• {name}</li>
                ))}
                {files.length > previewNames.length && <li>• ...e mais {files.length - previewNames.length}</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Entrada multimodal (texto ou transcrição)</label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
            placeholder="Opcional: contexto adicional para a ingestão."
          />
        </div>

        {message && <p className="text-sm text-secondary">{message}</p>}

        {batchResult && (
          <div className="rounded-2xl border border-border bg-surface-2 p-4 space-y-3">
            <p className="text-sm font-semibold">
              Reconheci {batchResult.processed} transações/eventos. {batchResult.possibleDuplicates} já existem (não serão duplicadas).
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-secondary">
              <span className="rounded-full border border-border px-2 py-1">Origem: {batchResult.source}</span>
              <span className="rounded-full border border-border px-2 py-1">Tipo detectado: {batchResult.detectedType}</span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={confirming}
                  onClick={confirmBatch}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {confirming ? "Confirmando..." : "Confirmar tudo"}
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("inbox-review")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
                >
                  Revisar
                </button>
              </div>
              <div id="inbox-review" className="rounded-xl border border-border bg-surface p-3 text-xs">
                <p className="font-semibold mb-2">Modo revisão</p>
                <ul className="space-y-1 text-secondary">
                  {batchResult.items.map((item) => (
                    <li key={`${item.index}-${item.eventId ?? "no-event"}`}>
                      • Item {item.index + 1}: <strong>{item.status}</strong> — {item.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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

        {eventsLoadError && (
          <p className="rounded-xl border border-amber-300 bg-amber-100/60 px-3 py-2 text-xs text-amber-900">{eventsLoadError}</p>
        )}

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
