import { Settings2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
        <p className="text-secondary mt-1">Categorias, integrações e preferências do sistema.</p>
      </header>
      
      <EmptyState 
        icon={Settings2}
        title="Preferências"
        description="Ajuste como o CtrlBank deve se comportar para a sua família."
      />
    </div>
  );
}
