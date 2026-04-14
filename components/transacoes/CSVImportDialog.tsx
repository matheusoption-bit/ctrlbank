"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { importTransactionsFromCSV } from "@/lib/actions/transaction.actions";
import { CSVTransactionRow } from "@/lib/validations/transaction.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/currency";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccountId: string;
  onSuccess: () => void;
}

interface ParsedRow {
  description: string;
  amount: number;
  date: string;
  type: "INCOME" | "EXPENSE";
}

export function CSVImportDialog({ open, onOpenChange, bankAccountId, onSuccess }: CSVImportDialogProps) {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: ParsedRow[] = [];

        for (const row of results.data as Record<string, string>[]) {
          // Try to map common CSV column names
          const description = row.description || row.descricao || row.Description || row.Descrição || "";
          const amountStr = row.amount || row.valor || row.Amount || row.Valor || "0";
          const dateStr = row.date || row.data || row.Date || row.Data || "";

          const amount = Math.abs(parseFloat(amountStr.replace(",", ".").replace(/[^\d.-]/g, "")) || 0);
          if (amount === 0 || !description) continue;

          const isIncome = parseFloat(amountStr.replace(",", ".").replace(/[^\d.-]/g, "")) > 0;

          rows.push({
            description: description.trim(),
            amount,
            date: dateStr,
            type: isIncome ? "INCOME" : "EXPENSE",
          });
        }

        setParsedRows(rows);
        if (rows.length === 0) {
          toast.error("Nenhuma transação válida encontrada no CSV");
        }
      },
      error: () => {
        toast.error("Erro ao processar arquivo CSV");
      },
    });
  }, []);

  const handleImport = async () => {
    if (!bankAccountId || parsedRows.length === 0) return;

    setIsImporting(true);
    try {
      const csvRows: CSVTransactionRow[] = parsedRows.map((row) => ({
        description: row.description,
        amount: row.amount,
        date: new Date(row.date),
        type: row.type,
        categoryId: null,
      }));

      const result = await importTransactionsFromCSV(csvRows, bankAccountId);

      if (result.success) {
        toast.success(`${result.imported} transações importadas`);
        setParsedRows([]);
        setFileName("");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error("Erro na importação", { description: result.error });
      }
    } catch {
      toast.error("Erro inesperado na importação");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setParsedRows([]);
      setFileName("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-background border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Importar CSV</DialogTitle>
        </DialogHeader>

        {parsedRows.length === 0 ? (
          /* Dropzone */
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-10 cursor-pointer hover:border-primary/40 transition-colors">
            <Upload className="w-10 h-10 text-secondary mb-3" strokeWidth={1.5} />
            <p className="text-sm font-medium text-white mb-1">
              {fileName || "Clique ou arraste um arquivo CSV"}
            </p>
            <p className="text-xs text-secondary">
              Colunas esperadas: descrição, valor, data
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          /* Preview */
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              <span className="text-secondary">{fileName}</span>
              <span className="text-primary font-semibold ml-auto">
                {parsedRows.length} transações
              </span>
            </div>

            {/* Preview table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-elevated text-secondary text-xs">
                    <th className="text-left px-4 py-2.5 font-medium">Descrição</th>
                    <th className="text-right px-4 py-2.5 font-medium">Valor</th>
                    <th className="text-center px-4 py-2.5 font-medium">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-2.5 text-white truncate max-w-[200px]">
                        {row.description}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-medium ${row.type === "INCOME" ? "text-success" : "text-danger"}`}>
                        {row.type === "INCOME" ? "+" : "-"}{formatCurrency(row.amount)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {row.type === "INCOME" ? (
                          <CheckCircle className="w-4 h-4 text-success mx-auto" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-danger mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 5 && (
                <div className="px-4 py-2 text-xs text-secondary text-center bg-surface border-t border-border">
                  ... e mais {parsedRows.length - 5} transações
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setParsedRows([]); setFileName(""); }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={isImporting}
                className="btn-primary flex-1"
              >
                {isImporting ? "Importando..." : `Importar ${parsedRows.length} transações`}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
