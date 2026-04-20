# Gap report interno — Busca Global e Assinaturas

## O que já existe e deve ser reaproveitado

| Área | Evidência | Decisão |
|---|---|---|
| Busca | `app/(dashboard)/buscar/page.tsx` existe, mas é apenas UI estática com input e copy. | Evoluir a rota existente em vez de recriar. |
| Escopo | `lib/security/scope.ts` expõe `scopeWhere`, já usado em actions. | Todas as consultas novas devem seguir esse padrão. |
| Transações | `app/actions/transactions.ts` já lista transações com `bankAccount`, `category` e `user`, além de filtro por texto em `description`. | Reaproveitar como referência de escopo, includes e shape de dados. |
| Contas | `app/actions/accounts.ts` já traz metadados de conta/cartão, inclusive `invoiceClosingDay`, `invoiceDueDay` e `creditLimit`. | Reaproveitar para exibir conta/cartão em assinaturas e para busca. |
| Recorrência | `RecurringTransaction` existe no schema e `app/actions/recurring.ts` já faz CRUD. | Tratar como recorrência genérica existente, não como assinatura de produto final. |
| Merchant intelligence | `MerchantMemory` e `CategoryLearningRule` existem; `lib/finance/merchant-dictionary.ts` já tem `normalizeMerchantKey`. | Reaproveitar normalização base e memória de merchant na detecção. |
| Navegação | `components/layout/DashboardLayoutClient.tsx` já concentra sidebar, drawer e atalho de busca no header. | Integrar `Assinaturas` ali sem mexer no bottom nav. |
| Processamentos | Existe rota `/processamentos` e estrutura operacional no domínio. | Incluir grupo na busca quando houver base suficiente. |

## Lacunas identificadas

| Área | Lacuna |
|---|---|
| Busca global | Não existe backend federado, nem agrupamento de resultados, nem navegação por entidades. |
| Assinaturas | Não existe modelo explícito de produto para assinaturas detectadas. |
| Logos/marcas | Não existe brand registry dedicado para subscriptions com aliases, logo e fallback premium. |
| Detecção | `autoDetectRecurring()` atual é muito superficial: agrupa apenas por descrição exata e quantidade. |
| UI de assinaturas | Não existe rota `/assinaturas`, componentes dedicados ou KPIs. |
| Testes | Não há cobertura para brand resolution, detecção de assinaturas ou busca global. |
| Baseline | O repositório já possui indícios de falhas prévias de typecheck/build em `/processamentos` e governança. |

## Direção de implementação

1. Criar modelagem explícita para `DetectedSubscription` + vínculo com transações.
2. Implementar registry de marcas e logo fallback reaproveitando a normalização existente.
3. Criar serviço de detecção explicável e persistente, cruzando transações, merchants e recorrência existente.
4. Implementar busca global federada com grupos: movimentos, assinaturas, contas, categorias, merchants e processamentos.
5. Construir `/assinaturas` com KPIs, filtros, cards e ações.
6. Integrar navegação desktop/mobile drawer e resultados de busca.
7. Corrigir regressões necessárias para fechar `lint`, `test` e `build`.
