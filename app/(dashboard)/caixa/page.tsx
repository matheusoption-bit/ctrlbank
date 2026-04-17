import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CaixaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Caixa</h1>
        <p className="text-secondary mt-1">Gestão de contas e fluxo de caixa familiar.</p>
      </header>
      
      <EmptyState 
        icon={Wallet}
        title="Fluxo de caixa"
        description="Em breve você poderá visualizar e gerenciar todas as entradas e saídas de forma consolidada."
      />
    </div>
  );
}
