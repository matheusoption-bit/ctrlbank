"use client";

import React, { useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import * as XLSX from "xlsx";
import { Download, FileText, Table } from "lucide-react";

interface Transaction {
  id: string; amount: number | string; type: string; date: Date | string; description: string | null;
  category: { id: string; name: string; taxClassification: string | null; icon: string | null; color: string | null } | null;
  bankAccount: { id: string; name: string; color: string | null };
  user: { id: string; name: string | null };
}

export default function ContadorPublicClient({ transactions, year }: { transactions: Transaction[], year: number }) {
  
  const txs = useMemo(() => transactions.map(t => ({ ...t, amount: Number(t.amount) })), [transactions]);

  // Totais
  const totalIncome = txs.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = txs.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const result = totalIncome - totalExpense;

  // Dedutíveis IR
  const deductibles = txs.filter(t => t.type === "EXPENSE" && t.category?.taxClassification === "DEDUCTIBLE_IR");
  const totalDeductibles = deductibles.reduce((s, t) => s + t.amount, 0);

  // Group by category para as despesas
  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { name: string; amount: number; isDeductible: boolean }>();
    txs.filter(t => t.type === "EXPENSE").forEach(t => {
      const key = t.category?.name ?? "Sem Categoria";
      const existing = map.get(key);
      if (existing) {
        existing.amount += t.amount;
      } else {
        map.set(key, { 
          name: key, 
          amount: t.amount, 
          isDeductible: t.category?.taxClassification === "DEDUCTIBLE_IR"
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [txs]);

  // Exportar PDF
  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Diagnóstico do período", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Ano Calendário: ${year}`, 20, 30);

    doc.setFont("helvetica", "bold");
    doc.text(`DRE Simplificado - ${year}`, 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text("Total Receitas:", 20, 55); doc.text(formatCurrency(totalIncome), 100, 55);
    doc.text("Total Despesas:", 20, 62); doc.text(formatCurrency(totalExpense), 100, 62);
    doc.setFont("helvetica", "bold");
    doc.text("Resultado Líquido:", 20, 72); doc.text(formatCurrency(result), 100, 72);

    doc.text("Despesas Dedutíveis (IR):", 20, 85); 
    doc.text(formatCurrency(totalDeductibles), 100, 85);

    let y = 100;
    doc.setFontSize(14);
    doc.text("Extrato - Todos os Movimentos", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text("Data", 20, y); doc.text("Tipo", 50, y); doc.text("Categoria", 80, y); doc.text("Valor", 160, y);
    y += 7;
    doc.setFont("helvetica", "normal");

    for (const tx of txs) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const d = new Date(tx.date).toLocaleDateString("pt-BR");
      const t = tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transf.";
      const c = tx.category?.name ?? "Sem categoria";
      const v = formatCurrency(tx.amount);

      if (tx.type === "INCOME") doc.setTextColor(34, 197, 94);
      else doc.setTextColor(239, 68, 68);

      doc.text(d, 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(t, 50, y); doc.text(c.slice(0, 25), 80, y); doc.text(v, 155, y, { align: "right" });
      y += 6;
    }

    doc.save(`relatorio-contador-${year}.pdf`);
  }

  // Exportar Excel
  function exportExcel() {
    const rows = txs.map(tx => ({
      Data: new Date(tx.date).toLocaleDateString("pt-BR"),
      Tipo: tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transf.",
      Categoria: tx.category?.name ?? "Sem Categoria",
      Classificação: tx.category?.taxClassification === "DEDUCTIBLE_IR" ? "Dedutível IR" : "-",
      Conta: tx.bankAccount.name,
      Descrição: tx.description ?? "",
      Valor: tx.amount
    }));

    const dreRows = [
      { Rubrica: "Total Receitas", Valor: totalIncome },
      { Rubrica: "Total Despesas", Valor: totalExpense },
      { Rubrica: "Resultado Líquido", Valor: result },
      { Rubrica: "", Valor: "" },
      { Rubrica: "Despesas Dedutíveis (IR)", Valor: totalDeductibles },
    ];

    const wb = XLSX.utils.book_new();
    const wsExtrato = XLSX.utils.json_to_sheet(rows);
    const wsDRE = XLSX.utils.json_to_sheet(dreRows);
    
    // Add sheets
    XLSX.utils.book_append_sheet(wb, wsDRE, "DRE Consolidadado");
    XLSX.utils.book_append_sheet(wb, wsExtrato, "Movimentos Anuais");

    XLSX.writeFile(wb, `relatorio-contador-${year}.xlsx`);
  }

  return (
    <div className="space-y-6">
      
      {/* Cards KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-c6-sm border-l-4 border-positive">
          <p className="text-secondary text-xs font-bold uppercase">Receitas {year}</p>
          <p className="text-xl font-black text-positive mt-1 tabular-nums">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card-c6-sm border-l-4 border-negative">
          <p className="text-secondary text-xs font-bold uppercase">Despesas {year}</p>
          <p className="text-xl font-black text-negative mt-1 tabular-nums">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="card-c6-sm border-l-4 border-primary">
          <p className="text-secondary text-xs font-bold uppercase">Resultado Líquido</p>
          <p className={`text-xl font-black mt-1 tabular-nums ${result >= 0 ? "text-positive" : "text-negative"}`}>
            {result >= 0 ? "+" : ""}{formatCurrency(result)}
          </p>
        </div>
        <div className="card-c6-sm border-l-4 border-info">
          <p className="text-secondary text-xs font-bold uppercase">Total Dedutível (IR)</p>
          <p className="text-xl font-black text-white mt-1 tabular-nums">{formatCurrency(totalDeductibles)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DRE Simplificado */}
        <div className="card-c6">
          <h2 className="font-bold text-lg mb-4">DRE - {year}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium text-secondary">Receitas</span>
              <span className="text-sm font-bold text-positive">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium text-secondary">Despesas</span>
              <span className="text-sm font-bold text-negative">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-surface-2 px-3 rounded-lg">
              <span className="text-sm font-bold">Resultado Lïquido</span>
              <span className={`text-sm font-black ${result >= 0 ? "text-positive" : "text-negative"}`}>
                {formatCurrency(result)}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-sm mb-3">Maiores Despesas</h3>
            <div className="space-y-2">
              {expenseByCategory.slice(0, 5).map(c => (
                <div key={c.name} className="flex justify-between items-center text-xs">
                  <span className="text-secondary flex items-center gap-1">
                    {c.isDeductible && <span className="bg-info text-white text-[8px] px-1 py-0.5 rounded font-bold uppercase">IR</span>}
                    {c.name}
                  </span>
                  <span className="font-semibold text-white">{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exportações */}
        <div className="space-y-4">
          <div className="card-c6 text-center space-y-4">
            <div className="bg-surface-2 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
              <Table size={24} />
            </div>
            <div>
              <h3 className="font-bold">Exportar Excel (.xlsx)</h3>
              <p className="text-xs text-secondary mt-1">Planilha completa contendo abas para o DRE e Extrato detalhado com todas as classificações.</p>
            </div>
            <button onClick={exportExcel} className="btn-primary w-full text-sm">
              <Download size={16} /> Baixar Excel Completo
            </button>
          </div>

          <div className="card-c6 text-center space-y-4">
            <div className="bg-surface-2 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-negative">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold">Exportar PDF</h3>
              <p className="text-xs text-secondary mt-1">Relatório paginado e bem formatado, pronto para arquivamento ou envio por email.</p>
            </div>
            <button onClick={exportPDF} className="btn-outline w-full text-sm hover:border-negative/50 hover:bg-negative/10 hover:text-negative transition-colors">
              <Download size={16} /> Baixar PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
