import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SaudePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Saúde</h1>
        <p className="text-secondary mt-1">Governança da saúde financeira familiar.</p>
      </header>
      
      <EmptyState 
        icon={Activity}
        title="Diagnóstico em processamento"
        description="Estamos analisando os dados da sua família para gerar o próximo diagnóstico de saúde."
      />
    </div>
  );
}
