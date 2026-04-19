# Testes de Invariantes

## Cobertura adicionada
- `__tests__/finance-kernel-invariants.test.ts`
  - saldo consolidado vs posição líquida para contas de crédito;
  - `net = income - expense`, ignorando `TRANSFER`, pendentes e `ignoreInTotals=true`;
  - fronteira mensal UTC determinística.

## Interpretação de falhas
- Falha de saldo/posição: divergência semântica entre páginas.
- Falha de net-flow: contabilidade operacional inconsistente.
- Falha de UTC bounds: possível bug de timezone/período.
