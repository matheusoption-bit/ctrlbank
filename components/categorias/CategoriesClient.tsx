"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Tag } from "lucide-react";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { seedDefaultCategories } from "@/lib/actions/category.actions";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

interface CategoryItem {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string | null;
  color: string | null;
}

interface CategoriesClientProps {
  categories: CategoryItem[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | undefined>();
  const [isSeeding, startSeeding] = useTransition();

  const incomeCategories = categories.filter((c) => c.type === "INCOME");
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  const handleOpenNew = () => {
    setSelectedCategory(undefined);
    setIsOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setSelectedCategory(undefined);
    router.refresh();
  };

  const handleSeedDefaults = () => {
    startSeeding(async () => {
      const result = await seedDefaultCategories();
      if (result.success) {
        toast.success("Categorias padrão criadas!");
        router.refresh();
      } else {
        toast.error("Erro", { description: result.error });
      }
    });
  };

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header className="flex justify-between items-start pt-2" variants={itemVariants}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
          <p className="text-secondary text-sm mt-1">Organize receitas e despesas</p>
        </div>
        <button onClick={handleOpenNew} className="hidden md:flex items-center gap-2 btn-primary !w-auto text-sm">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </motion.header>

      {categories.length === 0 ? (
        <motion.div variants={itemVariants} className="space-y-4">
          <EmptyState
            icon={Tag}
            title="Nenhuma categoria"
            description="Crie categorias para organizar suas transações ou use as categorias padrão."
            actionLabel={isSeeding ? "Criando..." : "Usar Categorias Padrão"}
            onAction={handleSeedDefaults}
          />
        </motion.div>
      ) : (
        <>
          {/* Income Section */}
          {incomeCategories.length > 0 && (
            <motion.section className="space-y-3" variants={itemVariants}>
              <div className="flex items-center gap-2.5 px-1">
                <div className="p-1.5 bg-success/10 rounded-lg">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                </div>
                <h2 className="text-base font-semibold">Receitas</h2>
                <span className="text-xs text-secondary">({incomeCategories.length})</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {incomeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="card-premium-sm flex items-center gap-3 text-left cursor-pointer hover:border-white/[0.08] transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: cat.color ? `${cat.color}18` : "rgba(161,161,170,0.1)" }}
                    >
                      {cat.icon || "📄"}
                    </div>
                    <span className="text-sm font-medium truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* Expense Section */}
          {expenseCategories.length > 0 && (
            <motion.section className="space-y-3" variants={itemVariants}>
              <div className="flex items-center gap-2.5 px-1">
                <div className="p-1.5 bg-danger/10 rounded-lg">
                  <ArrowDownLeft className="w-4 h-4 text-danger" />
                </div>
                <h2 className="text-base font-semibold">Despesas</h2>
                <span className="text-xs text-secondary">({expenseCategories.length})</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {expenseCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="card-premium-sm flex items-center gap-3 text-left cursor-pointer hover:border-white/[0.08] transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: cat.color ? `${cat.color}18` : "rgba(161,161,170,0.1)" }}
                    >
                      {cat.icon || "📄"}
                    </div>
                    <span className="text-sm font-medium truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.section>
          )}
        </>
      )}

      {/* Mobile FAB */}
      <button
        onClick={handleOpenNew}
        className="md:hidden fixed bottom-24 right-5 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-fab flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm initialData={selectedCategory} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
