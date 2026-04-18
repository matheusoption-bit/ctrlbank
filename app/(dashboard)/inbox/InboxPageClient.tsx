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

type ParsedItem = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

type ParseResponse = {
  items: ParsedItem[];
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [confirming, setConfirming] = useState(false);

  const hasEvents = useMemo(() => events.length > 0, [events]);

  async function sendForProcessing() {
    if (!selectedFile && !rawInput.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      if (rawInput.trim()) formData.append("rawInput", rawInput.trim());

      const response = await fetch("/api/inbox/parse", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ParseResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data?.error || "Não consegui interpretar. Tente outro arquivo.");
      }

      const items = Array.isArray(data.items) ? data.items : [];
      setParsedItems(items);
      setMessage(items.length > 0 ? null : "Não consegui interpretar. Tente outro arquivo.");
    } catch (error: any) {
      setMessage(error?.message || "Não consegui interpretar. Tente outro arquivo.");
      setParsedItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function confirmBatch() {
    if (parsedItems.length === 0) return;
    setConfirming(true);
    setMessage(null);

    try {
      const response = await fetch("/api/inbox/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: parsedItems }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível confirmar o lote.");
      }

      setMessage(data?.message || "Transações confirmadas com sucesso.");
      setParsedItems([]);
      setRawInput("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
            <h2 className="text-lg font-bold">Inbox funcional</h2>
            <p className="text-sm text-secondary">Envie um arquivo ou cole texto. Nós sugerimos as transações e você só confirma.</p>
          </div>
          <Link href="/inbox/history" className="text-sm font-semibold text-primary hover:underline">
            Histórico
          </Link>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-surface-2 p-5">
          <p className="text-sm font-semibold">Enviar arquivo (1 por vez)</p>
          <p className="text-xs text-secondary mt-1">Suporta imagem, PDF ou texto.</p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            >
              Escolher arquivo
            </button>
            <button
              type="button"
              disabled={loading || (!selectedFile && !rawInput.trim())}
              onClick={sendForProcessing}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Processando..." : "Interpretar"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,application/pdf,text/plain,.txt"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />

          {selectedFile && (
            <p className="mt-3 text-xs text-secondary">Arquivo selecionado: {selectedFile.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Ou cole o texto do extrato/fatura</label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
            placeholder="Ex: 12/04/2026 Mercado R$ 89,90"
          />
        </div>

        {message && <p className="text-sm text-secondary">{message}</p>}

        {parsedItems.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-4 space-y-3">
            <p className="text-sm font-semibold">Reconheci {parsedItems.length} transações</p>
            <ul className="space-y-2 text-sm">
              {parsedItems.map((item, index) => (
                <li key={`${item.description}-${index}`} className="rounded-xl border border-border bg-surface p-3">
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-xs text-secondary">
                    {new Date(item.date).toLocaleDateString("pt-BR")} · R$ {item.amount.toFixed(2).replace(".", ",")} · {item.type}
                  </p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={confirming}
              onClick={confirmBatch}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {confirming ? "Confirmando..." : "Confirmar"}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <h3 className="font-bold">Fila operacional recente</h3>

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
          <p className="text-sm text-secondary">Nenhum evento recente.</p>
        )}
      </section>
    </div>
  );
}
