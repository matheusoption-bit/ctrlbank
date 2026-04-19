export type ScopeContext = { userId: string; householdId: string | null };

export function scopeWhere(ctx: ScopeContext) {
  return ctx.householdId
    ? { householdId: ctx.householdId }
    : { userId: ctx.userId, householdId: null };
}

export function scopedAccessWhere<T extends object>(ctx: ScopeContext, extra?: T) {
  return {
    ...scopeWhere(ctx),
    ...(extra ?? {}),
  };
}
