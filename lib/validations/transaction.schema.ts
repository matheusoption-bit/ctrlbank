import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  amount: z.coerce.number().positive("O valor deve ser maior que 0"),
  description: z.string().min(1, "Descrição é obrigatória").max(200),
  date: z.coerce.date(),
  bankAccountId: z.string().min(1, "Selecione uma conta"),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["PENDING", "COMPLETED"]).default("COMPLETED"),
  installmentNumber: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
    z.number().min(1).nullable().optional()
  ),
  totalInstallments: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
    z.number().min(1).max(72).nullable().optional()
  ),
  ignoreInTotals: z.boolean().default(false),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

// Schema for CSV import rows
export const csvTransactionRowSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.coerce.number().positive(),
  date: z.coerce.date(),
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
  categoryId: z.string().optional().nullable(),
});

export type CSVTransactionRow = z.infer<typeof csvTransactionRowSchema>;
