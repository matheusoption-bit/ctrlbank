# CtrlBank Full Red-Team Audit — 2026-04-19

## 1. EXECUTIVE VERDICT

**Verdict:** **promising but fragile**, with multiple trust-breaking faults in accounting consistency, build stability, and authorization/scoping consistency.

Current trust level: **medium-low** for production financial governance usage.

Top 10 truths:
1. The project has broad functional ambition (auth/2FA, ingestion logs, signed artifacts, quotas, governance) but critical paths are inconsistent.
2. Accounting semantics differ across surfaces (e.g., credit-account handling and monthly windows), so users can see conflicting numbers.
3. The build currently fails on type errors in a key operational page.
4. The test suite has meaningful breadth but currently ships with failing tests around policy/quota/experiment/calibration enums.
5. Scope filtering is implemented in multiple divergent patterns, increasing leakage/mismatch risk.
6. Authorization is partially robust, but several actions still use permissive OR patterns that are harder to reason about.
7. Ingestion pipeline has good fail-closed intent (review required, integrity checks, staged confirm), but dedup and timeline truthfulness can still drift.
8. Health/projection math is directionally useful but not strict accounting; labels may overstate precision.
9. Export/report paths are partly client-side and can diverge from server-calculated values.
10. UX has strong components but high cognitive load and weak explainability for “why this number”.

## 2. SYSTEM MAP

### Architecture map
- **Frontend:** Next.js app routes for dashboard surfaces (`/saude`, `/caixa`, `/relatorios`, `/metas`, `/processamentos`, `/familia`, `/contas`).
- **Server actions:** financial CRUD, household/admin actions, health metrics, governance controls.
- **APIs:** auth, inbox parse/confirm/webhooks, artifacts/signature verify, cron jobs.
- **Data layer:** Prisma/Postgres schema with user/household core + financial + ingestion + governance + quality + experiments.

### Source-of-truth tables (core)
- **Balances/accounts:** `BankAccount.balance`
- **Movements:** `Transaction` with `type`, `status`, `ignoreInTotals`
- **Budgets/Goals:** `Budget`, `Goal`
- **Ingestion history:** `SourceDocument`, `AiCaptureEvent`, `IngestionLog`, `TransactionQualityFlag`
- **Evidence:** `SignedArtifact`

### Derived data paths (high-risk)
- Dashboard summary/evolution/forecast from mixed action helpers.
- Health score and projection from `lib/finance/health.ts`.
- Reports/DRE/export values from client-side aggregation in `RelatoriosPageClient` and counter page.
- Quotas/policies/experiments on processamentos/governance pages.

### Highest-risk zones
1. Scope consistency (`scopeWhere` vs legacy OR patterns).
2. Cross-page accounting invariants (Dashboard vs Caixa vs Relatórios vs Saúde).
3. Build/test reliability (currently broken).
4. Type safety drift between Prisma schema and query includes.

## 3. FINDINGS BY CATEGORY

### Security & Auth
- **2FA challenge lifecycle is decent but challenge-user binding is cookie-driven only (medium).**
  - Evidence: cookie-backed challenge retrieval/validation with max attempts + expiry.
  - Impact: acceptable for web session model, but brittle across multi-device or cookie theft.
  - Fix: bind challenge with nonce fingerprint and enforce challenge invalidation on login restart.
  - Owner: security/backend.

- **Rate limiting exists on login/2FA/invite generation (strength).**
  - Evidence in auth routes and household actions.
  - Impact: mitigates brute-force/replay pressure.

### Authorization & Multi-tenant Isolation
- **Divergent scoping models create inconsistent isolation semantics (high).**
  - Evidence: strict household-only `scopeWhere`, but many features still use `OR [{userId}, {householdId}]` mixed patterns.
  - Impact: risk of unexpected visibility, inconsistent totals, and hard-to-audit access boundaries.
  - Root cause: legacy migration from personal→household data model.
  - Fix: centralize a single scope kernel and ban ad-hoc OR scoping via lint/custom rule.
  - Owner: backend/security.

- **Some write operations rely on broad ownership OR checks (medium).**
  - Evidence: account/category delete/update use OR userId/householdId patterns.
  - Impact: not an obvious exploit today, but weakens formal guarantees.
  - Fix: enforce exact `scopeWhere` everywhere and add negative multi-tenant tests.
  - Owner: backend.

### Data Integrity & Transactions
- **Account balance is mutable independently from ledger consistency (high).**
  - Evidence: account update allows direct `balance` edits + optional synthetic adjustment transactions.
  - Impact: audit trail can drift from displayed balance.
  - Fix: prohibit direct balance mutation; only mutate via append-only ledger entries.
  - Owner: backend/data.

- **Transfer type exists but core balance delta logic ignores transfer (medium).**
  - Evidence: create/update/delete deltas only treat INCOME/EXPENSE.
  - Impact: transfer transactions may exist without balanced account effects.
  - Fix: introduce fromAccount/toAccount transfer model with paired entries.
  - Owner: backend/accounting.

### Accounting / Mathematical Correctness
- **Health consolidated balance back-calculation uses raw `_sum.amount` across all tx types (high).**
  - Evidence: `getConsolidatedBalance` computes “last month delta” from total amount without income-expense sign logic.
  - Impact: can misstate month-over-month change.
  - Fix: calculate delta as income-expense, exclude transfer or handle explicitly.
  - Owner: backend/finance.

- **Cashbox total treats credit accounts with a bespoke subtraction rule not shared globally (high).**
  - Evidence: Caixa subtracts abs(credit balance) while dashboard sums raw balances.
  - Impact: same “total balance” differs by page.
  - Fix: define single balance policy for credit accounts and reuse shared helper.
  - Owner: backend/product.

- **Month boundary calculations use local Date constructors in many places (medium).**
  - Impact: timezone boundary drift around UTC/local midnight.
  - Fix: normalize to UTC date windows or DB timezone-safe bounds.

### Page-to-Page Consistency
- **Relatórios KPI uses 6-month evolution while transaction table is month-filtered (high UX/math mismatch).**
  - Impact: user sees different totals in same view context.
  - Fix: label explicitly “6m” everywhere or align filters.

- **CSV/PDF exports are generated client-side from current in-memory list and can diverge from canonical server queries (high).**
  - Impact: exported “official” values may not match signed/server artifacts.
  - Fix: server-side export endpoints with deterministic query + signed checksum.

### Ingestion / AI / Processing
- **Strong fail-closed mechanics exist (strength).**
  - Evidence: staged parse, review-required gates, seal/signature verification on confirm, idempotent commit check.

- **Dedup logic split between hash-based source duplication and transaction similarity can still allow partial duplicates (medium).**
  - Impact: repeated ingestion via altered text/file can bypass one layer.
  - Fix: stronger canonical document fingerprint + probabilistic duplicate windows with human review.

### Reporting / Exports / Evidence
- **Signed artifacts store payloadBase64 inside metadata (medium).**
  - Impact: DB bloat and potential sensitive-data retention risk depending on payload contents.
  - Fix: store payload in object storage, keep hash pointer + minimal metadata.

- **Verification endpoint reveals token metadata publicly by design (low/medium).**
  - Ensure product/legal alignment and short token lifetimes/revocation if needed.

### Usability / UX
- **High cognitive load on Saúde and Relatórios (medium-high).**
  - Too many metrics with mixed time windows and insufficient provenance “from where this comes”.

- **Processamentos is conceptually strong but currently unshippable due to type/build break (critical operational UX).**

### Accessibility
- **Likely gaps in semantic controls and keyboard/focus handling in dense client components (medium).**
  - Evidence from extensive custom cards/charts and icon-heavy controls with limited explicit a11y props.

### Performance / Scalability
- **N+1-style per-item loops in recommendation generation and some reporting paths (medium).**
  - Impact: household-scale degradation.
  - Fix: batch queries and precompute materialized metrics.

### Test Coverage / Engineering Quality
- **Coverage breadth is good; correctness confidence is not (high).**
  - Evidence: tests exist across security/quota/policy/inbox, but suite currently fails in multiple foundational governance modules.
  - Fix: unblock enum imports/mocks; add invariant integration tests.

### Operational Reliability / Observability
- **Build and tests currently red (critical).**
  - Evidence: `npm run build` type error and `npm test` failures.
  - Fix: enforce CI fail-fast and no-merge policy on red main.

### Product Opportunities / Simplifications
- Collapse duplicated financial aggregation logic into one audited finance kernel.
- Expose “number provenance” UI: scope, period, filters, inclusions/exclusions.

## 4. ACCOUNTING VERIFICATION REPORT

### Invariants checked
1. Net cashflow = income - expenses across surfaces.
2. Balance reconciliation consistency.
3. Account sum consistency.
4. Category rollup consistency.
5. Goal progress formula sanity.
6. Budget usage formula sanity.
7. Forecast assumptions.
8. Health score formula bounds.
9. Export/report consistency.
10. Signed artifact integrity path.

### Results
- **Net cashflow:** fragile/inconsistent across pages due to differing filters and time windows.
- **Balance invariant:** broken conceptually between Dashboard (sum raw balances) and Caixa (credit special-case subtraction).
- **Account sum invariant:** page-dependent semantics; no unified policy.
- **Category rollup:** Relatórios computes from client transaction list; may diverge from backend aggregates.
- **Goal progress:** simple ratio in goals model; no transactional linkage so manual edits can mislead.
- **Budget usage:** appears formulaically correct within month/category scope, but month boundaries/timezone still risk drift.
- **Forecast/projection:** simplistic (recurring + avg variable/3), not robust against outliers/seasonality.
- **Health score:** bounded to ~0..100 but inputs mix different assumptions; classification can overstate certainty.
- **Exports:** client-side export can diverge from source-of-truth queries.
- **Signed artifact:** signature verification path exists and is meaningful.

### Reconciliation verdict
**Not trustworthy enough for strict financial governance** without unifying scope/time/accounting policies and export provenance.

## 5. PAGE CONSISTENCY MATRIX

- **Total balance**
  - Dashboard: sum of account balances.
  - Caixa: sum with credit accounts subtracted by abs(balance).
  - Status: mismatch.

- **Month income/expense**
  - Dashboard: server aggregates (completed + ignoreInTotals=false).
  - Relatórios: derives from fetched transactions; same filters partly but UI also mixes 6m KPI.
  - Status: partially aligned, context-confusing.

- **Health totals**
  - Saúde: multiple custom formulas (burn, projection, health score).
  - Other pages: direct sums/aggregates.
  - Status: intentionally different, but poorly explained.

- **Exported totals**
  - Relatórios/Contador: client-generated exports.
  - Artifacts: server-generated signed payload.
  - Status: trust split.

## 6. USABILITY AUDIT

### Surface scores (0-10)
- Dashboard (redirect to Saúde): 6
- Saúde: 6
- Caixa: 7
- Inbox: 7
- Processamentos: 4 (build/type instability)
- Metas: 7
- Relatórios: 6
- Família: 7
- Contas: 6
- Configurações: 6
- Contador surfaces: 6

### Major UX failures
- Mixed timeframe metrics without strong framing.
- Weak explainability of formulas and inclusions.
- Heavy card density; action hierarchy not obvious.
- Export trust ambiguity (local file vs signed evidence).

### Top 5 UX upgrades
1. Add “How this number is calculated” drawer on key cards.
2. Enforce period/scope pill globally on every financial card.
3. Distinguish operational analytics vs accounting facts visually.
4. Unified export center with server-generated signed outputs.
5. Simplify Saúde hero into prioritized alert/action narrative.

## 7. TEST GAP REPORT

### Existing strengths
- Dedicated tests for crypto/signature/session/totp/scope/inbox parser and governance subsystems.

### Dangerous blind spots
- Cross-page reconciliation tests absent.
- Multi-tenant negative tests incomplete.
- No strong integration tests for end-to-end ingestion→confirm→dashboard invariants.
- Export parity tests absent.

### Must-add tests now
1. Dashboard/Caixa/Relatórios same-period invariant suite.
2. Transfer accounting invariant tests.
3. Household isolation negative tests on every write action.
4. Signed artifact payload-vs-delivered export parity tests.
5. Timezone boundary tests for month windows.

## 8. TOP 25 PRIORITIZED FIXES

1. Fix build-breaking Processamentos Prisma include mismatch (S).
2. Fix failing governance/quota/experiment/calibration test stack (M).
3. Unify scope model; remove ad-hoc OR scoping (M).
4. Standardize balance policy (especially CREDIT) across all pages (M).
5. Replace direct account balance edits with ledger adjustments only (M).
6. Implement explicit transfer double-entry model (L).
7. Centralize period boundary helper (UTC-safe) (S).
8. Enforce consistent filters for all aggregates (S).
9. Make exports server-side canonical and signed (M).
10. Add reconciliation CI test gate (M).
11. Add household isolation mutation tests (M).
12. Add alert/recommendation provenance metadata in UI (S).
13. Add “formula transparency” tooltips/cards (S).
14. Refactor health calculations into documented, versioned policy (M).
15. Add outlier/seasonality handling in projections (M).
16. Harden dedup across channels with richer fingerprints (M).
17. Add idempotency key for confirm route payload-level commits (M).
18. Add dead-letter queue visibility for failed ingestions (M).
19. Add accessibility pass (focus, labels, semantics) to dense pages (M).
20. Reduce N+1 in recommendation generation loops (S).
21. Add materialized monthly aggregates for large households (L).
22. Add operational SLO dashboards and error budgets (M).
23. Add strict branch protection for green test/build only (S).
24. Migrate middleware convention to proxy (S).
25. Run schema/query contract checks in CI (S).

## 9. QUICK WINS VS STRUCTURAL FIXES

### 10 quick wins
1. Fix Processamentos include type mismatch.
2. Patch enum import/mocking failures in tests.
3. Add shared `getMonthBoundsUtc()`.
4. Label every KPI with time window.
5. Add inline “included filters” text.
6. Remove duplicated `revalidatePath('/caixa')` calls.
7. Add transfer warning if type=TRANSFER used.
8. Add lint rule to ban raw OR scope expressions.
9. Add export disclaimer until server canonical exports are live.
10. Add smoke test for build + key routes.

### 10 medium structural fixes
1. Finance aggregation kernel package.
2. Unified scope kernel enforced by typed wrappers.
3. Signed export service for PDF/CSV.
4. Ingestion replay/idempotency command.
5. Goal/budget linkage to transactions.
6. Health score policy versioning.
7. Recommendation dedupe strategy with semantic keys.
8. Query performance profiling + indexes.
9. Accessibility remediation backlog.
10. Domain event logging for auditability.

### 5 deep investments
1. Double-entry accounting ledger migration.
2. Event-sourced ingestion + reconciliation pipeline.
3. Data quality contracts with formal invariants.
4. Multi-tenant security verification suite (property-based).
5. Trust UX system (provenance-first product design).

## 10. FINAL RECOMMENDATION

Fix before calling solid:
- Build and test red state.
- Scope/accounting inconsistency across key pages.
- Transfer and balance model ambiguity.
- Export canonicalization and provenance.

Can wait:
- Advanced forecasting sophistication.
- Wave5 experimentation automation polish.

Should simplify:
- Duplicate aggregation logic scattered across actions/pages.
- Overlapping health/report cards without shared semantics.

Should remove:
- Any direct mutable-balance path that bypasses ledger evidence.

Double down on:
- Ingestion fail-closed and quality flag architecture.
- Artifact signature and verification model.
- Governance/quality telemetry once stabilized.
