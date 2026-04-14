"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "@/lib/validations/category.schema";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/category.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const EMOJI_OPTIONS = [
  "💰", "💻", "📈", "📥", "🍔", "🚗", "🏠", "🏥",
  "📚", "🎮", "🛍️", "📺", "☕", "🎬", "✈️", "🎁",
  "💳", "🔧", "🐾", "👶", "💅", "🎵", "📱", "⚡",
];

const COLOR_OPTIONS = [
  "#FF2D55", "#FF3B5C", "#FF9500", "#00C853",
  "#5AC8FA", "#5856D6", "#AF52DE", "#A1A1AA",
];

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    icon: string | null;
    color: string | null;
  };
  onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || "",
      type: initialData?.type || "EXPENSE",
      icon: initialData?.icon || "📄",
      color: initialData?.color || "#A1A1AA",
    },
  });

  const selectedIcon = form.watch("icon");
  const selectedColor = form.watch("color");

  function onSubmit(values: CategoryFormValues) {
    setError(null);
    startTransition(async () => {
      const action = initialData ? updateCategory : createCategory;
      const res = await action(values);
      if (!res.success) {
        setError(res.error || "Erro ao salvar categoria.");
        toast.error("Erro", { description: res.error });
      } else {
        toast.success(initialData ? "Categoria atualizada" : "Categoria criada");
        if (onSuccess) onSuccess();
      }
    });
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("Excluir esta categoria?")) return;

    startTransition(async () => {
      const res = await deleteCategory(initialData.id);
      if (!res.success) {
        toast.error("Erro ao excluir", { description: res.error });
      } else {
        toast.success("Categoria excluída");
        if (onSuccess) onSuccess();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="p-3 text-sm text-danger bg-danger/10 rounded-xl">{error}</div>}

        {/* Type toggle */}
        <div className="space-y-2">
          <label className="section-label">Tipo</label>
          <div className="flex gap-2">
            {(["INCOME", "EXPENSE"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => form.setValue("type", type)}
                className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                  form.watch("type") === type
                    ? type === "INCOME"
                      ? "bg-success/15 border border-success/40 text-success"
                      : "bg-danger/15 border border-danger/40 text-danger"
                    : "bg-surface border border-border text-secondary hover:bg-surface-elevated"
                }`}
              >
                {type === "INCOME" ? "Receita" : "Despesa"}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Alimentação..." className="bg-surface border-border h-12 rounded-xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emoji Picker */}
        <div className="space-y-2">
          <label className="section-label">Ícone</label>
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => form.setValue("icon", emoji)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                  selectedIcon === emoji
                    ? "bg-primary/15 border border-primary/40 scale-110"
                    : "bg-surface border border-border hover:bg-surface-elevated"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <label className="section-label">Cor</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => form.setValue("color", color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  selectedColor === color
                    ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <Button type="submit" className="flex-1 btn-primary" disabled={isPending}>
            {isPending ? "Salvando..." : initialData ? "Atualizar" : "Criar Categoria"}
          </Button>
          {initialData && (
            <Button type="button" variant="destructive" className="px-6 rounded-xl" onClick={handleDelete} disabled={isPending}>
              Excluir
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
