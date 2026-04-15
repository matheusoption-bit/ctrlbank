"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScannedData {
  valor: number | null;
  data: string;
  estabelecimento: string | null;
  categoria: string;
  descricao: string | null;
  tipo: "INCOME" | "EXPENSE";
}

interface ReceiptScanButtonProps {
  onScanComplete: (data: ScannedData) => void;
  className?: string;
}

export default function ReceiptScanButton({
  onScanComplete,
  className = "",
}: ReceiptScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScanning(true);

    // Preview da imagem
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Converter para base64 sem o prefixo data:...
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const result = r.result as string;
          // Remover "data:image/jpeg;base64," para enviar só o base64
          resolve(result.split(",")[1]);
        };
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      const response = await fetch("/api/receipt-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao escanear");
      }

      if (result.success) {
        onScanComplete(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar imagem");
    } finally {
      setScanning(false);
      // Limpar input para permitir re-scan do mesmo arquivo
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Botão principal */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={scanning}
        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-dashed border-white/20 text-secondary hover:border-primary/40 hover:text-white hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {scanning ? (
          <>
            <Loader2 size={16} className="animate-spin text-primary" />
            Lendo comprovante com IA...
          </>
        ) : (
          <>
            <Camera size={16} />
            Ler comprovante / nota fiscal
          </>
        )}
      </button>

      {/* Input file oculto — capture="environment" abre câmera traseira no mobile */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Selecionar imagem do comprovante"
      />

      {/* Preview da imagem escaneada */}
      <AnimatePresence>
        {preview && !scanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative rounded-xl overflow-hidden border border-white/10"
          >
            <img
              src={preview}
              alt="Comprovante escaneado"
              className="w-full max-h-48 object-cover"
            />
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Remover preview"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
              <p className="text-white text-xs font-semibold">✓ Comprovante lido</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erro */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-negative flex items-center gap-1"
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
