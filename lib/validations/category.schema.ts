import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
