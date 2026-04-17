"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type InboxEvent = {
  id: string;
  source: string;
  createdAt: string;
  rawText: string | null;
  normalizedDraft: any;
};

type Props = {
  events: InboxEvent[];
};

function sourceBadge(source: string) {
  if (source === "via_ocr") return "via OCR";
  if (source === "via_pdf") return "via PDF";
  return null;
}

export default function InboxPageClient({ events }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"eventos" | "upload">("eventos");
  const [rawInput, setRawInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasEvents = useMemo(() => events.length > 0, [events]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (rawInput.trim()) formData.append("rawInput", rawInput.trim());

      const response = await fetch("/api/inbox/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao processar item na Inbox");
      }

      setMessage(data?.message || "Entrada processada com sucesso.");
      setRawInput("");
      setFile(null);
      router.refresh();
    } catch (error: any) {
      setMessage(error?.message || "Falha ao processar entrada");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-2xl border border-border bg-surface-2 p-1">
        <button
          className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === "eventos" ? "bg-primary text-white" : "text-secondary"}`}
          onClick={() => setTab("eventos")}
          type="button"
        >
          TAB 1 · Eventos
        </button>
        <button
          className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === "upload" ? "bg-primary text-white" : "text-secondary"}`}
          onClick={() => setTab("upload")}
          type="button"
        >
          TAB 2 · Upload
        </button>
      </div>

      {tab === "upload" ? (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-secondary">Upload → extração OCR/texto → parse financeiro.</p>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Arquivo (JPG/PNG/PDF)</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Texto manual (opcional)</label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
              placeholder="Cole aqui o texto do comprovante, se necessário"
            />
          </div>

          <button
            disabled={loading || (!file && !rawInput.trim())}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Processando..." : "Enviar para Inbox"}
          </button>

          {message && <p className="text-sm text-secondary">{message}</p>}
        </form>
      ) : hasEvents ? (
        <div className="space-y-3">
          {events.map((event) => {
            const badge = sourceBadge(event.source);
            const draft = (event.normalizedDraft && typeof event.normalizedDraft === "object") ? event.normalizedDraft : null;

            return (
              <article key={event.id} className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{draft?.description ?? "Evento capturado"}</p>
                  {badge && <span className="rounded-full bg-primary/15 text-primary text-xs font-bold px-2 py-1">{badge}</span>}
                </div>
                <p className="text-sm text-secondary">
                  {draft?.amount ? `R$ ${Number(draft.amount).toFixed(2).replace(".", ",")}` : "Valor pendente"}
                  {draft?.categoryName ? ` · ${draft.categoryName}` : ""}
                </p>
                <p className="text-xs text-secondary">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-5 text-secondary">
          Nenhum evento na Inbox ainda.
        </div>
      )}
    </div>
  );
}
