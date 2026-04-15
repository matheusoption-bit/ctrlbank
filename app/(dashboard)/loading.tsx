import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      
      {/* Círculo principal com pulso */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute w-16 h-16 bg-primary/30 rounded-full animate-pulse" />
        <div className="w-12 h-12 bg-surface border border-border shadow-soft-xl rounded-full flex items-center justify-center relative z-10">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-lg font-black tracking-tight text-white animate-pulse">Carregando dados...</h2>
        <p className="text-xs text-secondary font-medium tracking-wide w-[200px]">Aguarde enquanto preparamos o seu painel financeiro.</p>
      </div>

      {/* Shimmer placeholders */}
      <div className="w-full max-w-sm mt-8 space-y-3 px-6">
        <div className="h-20 w-full bg-[#1C1C1E] rounded-2xl animate-pulse overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="flex gap-3">
          <div className="h-24 flex-1 bg-[#1C1C1E] rounded-2xl animate-pulse overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
          <div className="h-24 flex-1 bg-[#1C1C1E] rounded-2xl animate-pulse overflow-hidden relative" style={{ animationDelay: "150ms" }}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </div>

    </div>
  );
}
