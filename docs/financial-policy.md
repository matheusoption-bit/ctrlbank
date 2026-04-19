# Política Financeira Oficial (CtrlBank)

## 1) Saldo e crédito
- **Saldo consolidado contábil (`accountingBalance`)**: soma direta dos saldos das contas.
- **Posição líquida (`netPosition`)**: contas de crédito entram como exposição (subtrai `abs(balance)`).
- As duas métricas coexistem e nunca devem compartilhar o mesmo rótulo.

## 2) Fluxo mensal (income/expense/net)
- Considerar somente transações `COMPLETED` e `ignoreInTotals=false`.
- `TRANSFER` não entra em `income`/`expense`.
- Invariante obrigatório: `net = income - expense`.

## 3) Período
- Fronteiras de mês são em **UTC** via `getMonthBoundsUtc`.
- Todas as páginas e exports oficiais devem usar o mesmo helper.

## 4) Transferências
- `TRANSFER` está bloqueado nos writes manuais até concluir o modelo contábil de dupla perna (`fromAccountId`/`toAccountId`).

## 5) Saldo de conta
- Saldo não é sobrescrito em edição comum.
- Ajustes devem gerar evento contábil (`transaction`) com trilha e, então, atualizar saldo por incremento.

## 6) Export oficial
- Export oficial deve derivar do mesmo kernel financeiro canônico usado na UI.
