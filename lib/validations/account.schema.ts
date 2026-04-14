import { z } from "zod";

export const bankAccountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome da conta deve ter pelo menos 2 caracteres"),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT", "INVESTMENT"]),
  balance: z.coerce.number(),
  color: z.string().optional(),
  // Campos de Cartão de Crédito
  creditLimit: z.coerce.number().optional().nullable(),
  invoiceClosingDay: z.coerce.number().min(1).max(31).optional().nullable(),
  invoiceDueDay: z.coerce.number().min(1).max(31).optional().nullable(),
}).refine(
  (data) => {
    if (data.type === "CREDIT") {
      return data.creditLimit != null && data.invoiceClosingDay != null && data.invoiceDueDay != null;
    }
    return true;
  },
  {
    message: "Cartão de crédito exige limite, dia de corte e dia de vencimento.",
    path: ["creditLimit"],
  }
);

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
