# Política de Scope/Autorização

- O helper canônico é `scopeWhere({ userId, householdId })`.
- Com household: escopo obrigatório por `householdId`.
- Sem household: escopo restrito a `{ userId, householdId: null }`.
- Está proibido usar `OR` amplo de ownership em writes financeiros sensíveis.
- Ações de update/delete devem combinar `id` + `scopeWhere`.
