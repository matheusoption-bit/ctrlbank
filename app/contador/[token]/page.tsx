import { getCounterReports } from "@/app/actions/counter";
import ContadorPublicClient from "./ContadorPublicClient";
import { Shield } from "lucide-react";

export default async function PublicCounterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await getCounterReports(token);

  if (res.error || !res.transactions) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background text-white p-4">
        <div className="card-c6 max-w-sm text-center">
          <Shield size={48} className="mx-auto mb-4 text-negative" />
          <h1 className="text-xl font-bold mb-2">Acesso Inválido</h1>
          <p className="text-sm text-secondary">{res.error ?? "Token desconhecido ou expirado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-white">
      {/* Banner Público */}
      <div className="bg-primary text-white text-xs font-bold text-center py-2 px-4 shadow-soft">
        Modo Somente Leitura — Acesso Contador
      </div>
      
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <header className="mb-8">
          <p className="section-label">Acesso Concedido por {res.householdName ?? "Família"}</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">{res.sessionLabel ?? "Relatório Financeiro"} – {res.year}</h1>
          <p className="text-sm text-secondary mt-2">
            Este relatório contém todas as movimentações consolidadas do ano-calendário {res.year}, organizadas para fechamento e declaração.
          </p>
        </header>

        <ContadorPublicClient 
          transactions={res.transactions.map(t => ({ ...t, amount: Number(t.amount) }))} 
          year={res.year!} 
        />
      </div>
    </div>
  );
}
