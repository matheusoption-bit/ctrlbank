import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox</h1>
        <p className="text-secondary mt-1">Central de captura de eventos e movimentos.</p>
      </header>
      
      <EmptyState 
        icon={Inbox}
        title="Nada pendente"
        description="Sua caixa de entrada está limpa. Novos eventos de IA aparecerão aqui."
      />
    </div>
  );
}
