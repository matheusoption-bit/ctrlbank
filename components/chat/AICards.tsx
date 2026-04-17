import React, { useTransition } from "react";
import { Check, Undo2, ChevronDown, Sparkles, AlertTriangle, Settings2, LayoutList, Loader2, Trash, BarChart3 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { AIComposerBatchDraftItem, AIComposerTransactionDraft } from "@/lib/ai/contracts";
import Link from "next/link";
import { approveAiDraft } from "@/app/actions/ai/review";
import { toast } from "sonner";
import { undoTransaction } from "@/app/actions/transactions";
import { formatCurrency } from "@/lib/format";

export function SuccessCard({ 
  draft, txId, onUndo
}: { 
  draft: AIComposerTransactionDraft, txId: string, onUndo: () => void 
}) {
  const [isPending, startTransition] = useTransition();

  const handleUndo = () => {
    startTransition(async () => {
      const result = await undoTransaction(txId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Transação desfeita.");
        onUndo();
      }
    });
  };

  return (
    <div className="card-c6 space-y-3 border border-border/40 relative overflow-hidden bg-surface">
      <div className="absolute top-0 left-0 w-1 h-full bg-positive"></div>
      <div className="flex items-center gap-2 text-positive">
        <Check size={18} />
        <p className="font-bold text-sm">Movimento registrado com sucesso!</p>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-black">{formatCurrency(Number(draft.amount ?? 0))}</p>
        <p className="text-sm text-secondary font-medium">{draft.description}</p>
      </div>

      <div className="flex gap-2 flex-wrap pt-2">
        {draft.accountName && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-secondary font-semibold border border-white/10">{draft.accountName}</span>}
        {draft.categoryName && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-secondary font-semibold border border-white/10">{draft.categoryName}</span>}
        <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-semibold border border-primary/20">Auto-Saved</span>
      </div>

      <button onClick={handleUndo} disabled={isPending} className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-surface-2 border border-border rounded-xl text-sm font-semibold hover:border-negative/50 hover:text-negative hover:bg-negative/5 transition-all">
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Undo2 size={16} />} 
        Desfazer instantâneo
      </button>
    </div>
  );
}

export function DraftReviewCard({ 
  draft, missingFields, accounts, categories, eventId, onApproved
}: { 
  draft: AIComposerTransactionDraft, missingFields: string[], accounts: any[], categories: any[], eventId: string | null, onApproved: () => void 
}) {
  const [internalDraft, setInternalDraft] = React.useState(draft);
  const [isPending, startTransition] = useTransition();

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await approveAiDraft(internalDraft, eventId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Movimento aprovado e aprendizado salvo!");
        onApproved();
      }
    });
  };

  return (
    <div className="bg-surface-2 border border-border rounded-2xl p-4 shadow-soft">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center justify-between pb-1">
          Quick Review
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded flex items-center gap-1">
            <Sparkles size={8} /> {(internalDraft.confidence.overall * 100).toFixed(0)}% Match
          </span>
        </p>
        <p className="text-xs text-secondary leading-relaxed pt-1">
          Revise os dados abaixo.
        </p>
      </div>

      <form onSubmit={submitReview} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold">Valor</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
            <CurrencyInput value={internalDraft.amount || ""} onValueChange={(v) => setInternalDraft({...internalDraft, amount: v ? Number(v) : null})} className="input-c6-sm w-full pl-9 font-bold" required placeholder="0,00" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold">Descrição Rápida</label>
          <input type="text" value={internalDraft.description} onChange={(e) => setInternalDraft({...internalDraft, description: e.target.value})} className="input-c6-sm w-full" required />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold flex justify-between">
            Conta 
            {missingFields?.includes("account") && <span className="text-negative font-bold">Obrigatório</span>}
          </label>
          <div className="relative">
            <select value={internalDraft.accountId || ""} onChange={(e) => setInternalDraft({...internalDraft, accountId: e.target.value})} className={`input-c6-sm w-full appearance-none pr-8 ${missingFields?.includes("account") && !internalDraft.accountId ? "border-negative/50 bg-negative/5" : ""}`} required>
              <option value="">Selecione de onde saiu / onde entrou...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold">Categoria</label>
          <div className="relative">
            <select value={internalDraft.categoryId || ""} onChange={(e) => setInternalDraft({...internalDraft, categoryId: e.target.value})} className="input-c6-sm w-full appearance-none pr-8">
              <option value="">Outros...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary w-full py-2 mt-4 text-sm font-bold flex gap-2 items-center justify-center">
          {isPending ? <Loader2 size={16} className="animate-spin text-white" /> : <><Check size={16}/> Salvar Manualmente</>}
        </button>
      </form>
    </div>
  );
}

export function BatchReviewCard({ 
  items, onComplete 
}: { 
  items: AIComposerBatchDraftItem[], onComplete: () => void 
}) {
  const [internalItems, setInternalItems] = React.useState(items);
  const [isPending, startTransition] = React.useTransition();

  const handleApproveAll = () => {
    startTransition(async () => {
       for (const item of internalItems) {
          const d = item.draft;
          if (!d.accountId || !d.amount || !d.description) continue; // skip invalid in batch
          await approveAiDraft(d, item.eventId);
       }
       toast.success("Lote aprovado!");
       onComplete();
    });
  };

  const removeDraft = (i: number) => {
    setInternalItems(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-soft">
       <div className="mb-4">
         <p className="text-xs font-bold flex items-center gap-2"><LayoutList size={16} className="text-primary"/> Batch Import</p>
         <p className="text-[11px] text-secondary">Temos {internalItems.length} itens aguardando aprovação.</p>
       </div>
       <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
         {internalItems.map((item, i) => {
            const d = item.draft;
            return (
            <div key={i} className="flex flex-col gap-1 p-2 bg-surface-2 border border-border/50 rounded-xl relative">
              <div className="flex justify-between items-start">
                 <p className="text-sm font-bold">{formatCurrency(Number(d.amount ?? 0))}</p>
                 <button onClick={() => removeDraft(i)} className="text-secondary hover:text-negative"><Trash size={12} /></button>
              </div>
              <p className="text-[10px] text-secondary truncate">{d.description}</p>
              <div className="flex gap-1">
                 <span className={`text-[9px] px-1 rounded ${d.accountId ? "bg-primary/10 text-primary" : "bg-negative/20 text-negative"}`}>{d.accountId ? "Conta OK" : "Sem Conta"}</span>
                 <span className={`text-[9px] px-1 rounded ${d.amount ? "bg-primary/10 text-primary" : "bg-negative/20 text-negative"}`}>{d.amount ? "Valor OK" : "Sem Valor"}</span>
              </div>
            </div>
         )})}
       </div>
       {internalItems.length > 0 && (
         <button onClick={handleApproveAll} disabled={isPending} className="btn-primary w-full py-2 mt-4 text-sm font-bold flex justify-center">
            {isPending ? <Loader2 size={16} className="animate-spin text-white" /> : "Aprovar Lote Válido"}
         </button>
       )}
    </div>
  );
}

export function NextBestActionCard({ 
  missingAccount, onSwitchToReview
}: { 
  missingAccount: boolean;
  onSwitchToReview: () => void;
}) {
  return (
    <div className="card-c6 border-primary/30 bg-primary/5 space-y-3">
      <div className="flex gap-2 items-start text-primary">
        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
        <p className="font-bold text-sm leading-tight">
          {missingAccount ? "Defina uma conta padrão para liberar o autosave." : "Informações faltantes para autosave."}
        </p>
      </div>
      {missingAccount && (
        <div className="flex flex-col gap-2 pt-1">
          <Link href="/contas?highlightDefault=1&from=ai-composer" className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:scale-[1.02] transition-transform">
            <Settings2 size={16} /> Definir conta padrão
          </Link>
          <button onClick={onSwitchToReview} className="text-xs font-semibold text-secondary hover:text-white transition-colors py-1">
            Revisar manualmente
          </button>
        </div>
      )}
    </div>
  );
}

export function SavedPlanCard({ planId, planData }: { planId?: string, planData: any }) {
  return (
    <div className="card-c6 border border-primary/20 bg-surface space-y-3 relative overflow-hidden mt-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
      <div className="flex items-center gap-2 text-primary font-bold pb-2 border-b border-border/50">
        <Sparkles size={16} /> Plano Salvo
      </div>
      <div>
        <p className="font-black text-sm">{planData.title || "Objetivo Financeiro"}</p>
        <p className="text-xs text-secondary mt-1">{planData.summary}</p>
      </div>
      {(planData.targetAmount || planData.monthlyRequiredAmount) && (
         <div className="grid grid-cols-2 gap-2 mt-2">
            {planData.targetAmount && (
               <div className="p-2 bg-surface-2 rounded-lg text-xs">
                  <p className="text-secondary mb-1">Alvo</p>
                  <p className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(planData.targetAmount))}</p>
               </div>
            )}
            {planData.monthlyRequiredAmount && (
               <div className="p-2 bg-surface-2 rounded-lg text-xs">
                  <p className="text-secondary mb-1">Poupar/Mês</p>
                  <p className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(planData.monthlyRequiredAmount))}</p>
               </div>
            )}
         </div>
      )}
      <div className="w-full py-2 mt-2 text-xs font-bold flex gap-2 items-center justify-center bg-primary/10 text-primary border border-primary/20 rounded-xl">
        <BarChart3 size={14}/> Plano salvo nesta conversa
      </div>
    </div>
  );
}

export function RecommendationCard({ recommendation }: { recommendation: { message: string, type: string, actionLabel?: string, actionTarget?: string } }) {
  return (
    <div className="card-c6 border border-info/20 bg-info/5 space-y-2 relative overflow-hidden mt-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-info/80"></div>
      <div className="flex gap-2 text-sm text-foreground items-start">
         <Sparkles size={16} className="text-info shrink-0 mt-0.5" />
         <p className="leading-relaxed">{recommendation.message}</p>
      </div>
      {recommendation.actionLabel && recommendation.actionTarget && (
         <Link href={recommendation.actionTarget} className="mt-2 inline-flex border border-info/30 bg-info/10 text-info hover:bg-info hover:text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors">
            {recommendation.actionLabel}
         </Link>
      )}
    </div>
  );
}

export function ProductFeedbackCard({ feedbackId, normalizedFeedback }: { feedbackId?: string, normalizedFeedback: any }) {
  return (
    <div className="card-c6 border border-secondary/20 bg-surface space-y-3 relative overflow-hidden mt-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-secondary/80"></div>
      <div className="flex items-center gap-2 text-secondary font-bold pb-2 border-b border-border/50">
        <Sparkles size={16} /> Sugestão Registrada
      </div>
      <div>
        <p className="font-black text-sm">{normalizedFeedback.title || "Feedback de Produto"}</p>
        <p className="text-xs text-secondary mt-1">{normalizedFeedback.summary}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="p-2 bg-surface-2 rounded-lg text-[10px]">
          <p className="text-secondary mb-1 uppercase font-bold tracking-tighter">Tipo</p>
          <p className="font-bold truncate">{normalizedFeedback.type}</p>
        </div>
        <div className="p-2 bg-surface-2 rounded-lg text-[10px]">
          <p className="text-secondary mb-1 uppercase font-bold tracking-tighter">Área</p>
          <p className="font-bold truncate">{normalizedFeedback.area}</p>
        </div>
        <div className="p-2 bg-surface-2 rounded-lg text-[10px]">
          <p className="text-secondary mb-1 uppercase font-bold tracking-tighter">Impacto</p>
          <p className="font-bold truncate">{normalizedFeedback.impact}</p>
        </div>
      </div>
      <div className="w-full py-2 mt-2 text-[10px] font-bold flex gap-2 items-center justify-center bg-secondary/10 text-secondary border border-secondary/20 rounded-xl">
        ID: #{feedbackId}
      </div>
    </div>
  );
}
