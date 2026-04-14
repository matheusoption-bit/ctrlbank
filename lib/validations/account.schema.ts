import { z } from "zod";

export const bankAccountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome da conta deve ter pelo menos 2 caracteres"),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT", "INVESTMENT"]),
  balance: z.coerce.number(),
  color: z.string().optional().nullable(),
  creditLimit: z.preprocess((val) => val === "" || val === undefined ? null : Number(val), z.number().nullable().optional()),
  invoiceClosingDay: z.preprocess((val) => val === "" || val === undefined ? null : Number(val), z.number().min(1).max(31).nullable().optional()),
  invoiceDueDay: z.preprocess((val) => val === "" || val === undefined ? null : Number(val), z.number().min(1).max(31).nullable().optional()),
}).superRefine((data, ctx) => {
  if (data.type === "CREDIT") {
    if (data.creditLimit == null || data.creditLimit <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Limite de crédito é obrigatório e deve ser maior que 0", path: ["creditLimit"] });
    }
    if (!data.invoiceClosingDay) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Dia de corte é obrigatório", path: ["invoiceClosingDay"] });
    }
    if (!data.invoiceDueDay) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Dia de vencimento é obrigatório", path: ["invoiceDueDay"] });
    }
  } else {
    data.creditLimit = null;
    data.invoiceClosingDay = null;
    data.invoiceDueDay = null;
  }
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
