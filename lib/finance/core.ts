import { TransactionType, TransactionStatus } from "@prisma/client";

export interface AuthContext {
  id: string;
  householdId: string | null;
}

/**
 * Cria o escopo de segurança para consultas financeiras (Contas, Transações, Categorias).
 *
 * @param ctx AuthContext atual do usuário
 * @param requireHousehold Se true, limita apenas para registros do household (usado em Orçamentos/Metas). 
 * Se false (mixed scope), busca do household atual E os registros soltos do usuário.
 */
export function buildAuthFilter(ctx: AuthContext, requireHousehold = false) {
  if (requireHousehold) {
    if (!ctx.householdId) {
      // Força um retorno vazio se existir a obrigatoriedade e ele não tiver household
      return { householdId: "NO_HOUSEHOLD_ATTACHED_FORCE_EMPTY" };
    }
    return { householdId: ctx.householdId };
  }

  // Mixed scope: vê os dados do Household atual + os próprios dados sem household (ainda não migrados)
  return {
    OR: [
      { householdId: ctx.householdId ?? "NO_HOUSEHOLD_ATTACHED_FORCE_EMPTY" },
      { userId: ctx.id, householdId: null },
    ],
  };
}

export interface AnalyticFilterParams {
  month?: number;
  year?: number;
  bankAccountId?: string;
  categoryId?: string;
}

/**
 * Cria os filtros analíticos unificados que definem o que "vale" para o DRE,
 * Relatórios, Orçamentos e Gráficos no app inteiro.
 */
export function buildAnalyticFilter(params?: AnalyticFilterParams) {
  const filter: any = {
    status: "COMPLETED" as TransactionStatus,
    ignoreInTotals: false,
  };

  if (params?.bankAccountId) {
    filter.bankAccountId = params.bankAccountId;
  }

  if (params?.categoryId) {
    filter.categoryId = params.categoryId;
  }

  if (params?.month && params?.year) {
    const start = new Date(params.year, params.month - 1, 1);
    const end = new Date(params.year, params.month, 0, 23, 59, 59);
    filter.date = { gte: start, lte: end };
  }

  return filter;
}
