"use client";

import React, { useState, useEffect } from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string | number;
  onValueChange: (val: string) => void;
}

export function CurrencyInput({ value, onValueChange, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Sync prop value -> display (initial mostly)
  useEffect(() => {
    if (value === "" || value === null || value === undefined) {
      setDisplayValue("");
      return;
    }
    
    // Converte o numérico/string recebido para o formato BRL mas sem 'R$ ' pra exibir apenas valor
    const num = Number(value);
    if (!isNaN(num)) {
      const parts = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      setDisplayValue(parts);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Remove all non-digits
    const justDigits = rawValue.replace(/\D/g, "");
    
    if (!justDigits) {
      setDisplayValue("");
      onValueChange("");
      return;
    }

    // Convert string of digits to actual number/string considering it as cents
    const floatValue = Number(justDigits) / 100;
    
    // Update local state and parent state
    const formattedDisplay = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(floatValue);
    
    setDisplayValue(formattedDisplay);
    // Envia o plain float string como "10.00" pra api lidar
    onValueChange(floatValue.toString());
  };

  return (
    <div className="relative w-full">
      <input
        type="hidden"
        name={props.name}
        value={value ?? ""}
      />
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={className}
        {...{...props, name: undefined}} // Oclude o name do input textual
      />
    </div>
  );
}
