# Wave 4 — Operational Scale / Institutional Evidence / Governance

## Assinatura institucional e lifecycle de chaves

A assinatura de artefatos usa `ARTIFACT_SIGNING_KEYRING_JSON`, com política explícita:

- **ACTIVE**: única chave que assina novos artefatos.
- **RETIRED**: não assina novos artefatos, mas valida histórico.
- **REVOKED**: nunca assina e retorna status `REVOKED_KEY` na verificação.

Formato da variável:

```json
[
  {"id":"k1","algorithm":"hmac-sha256","status":"ACTIVE","secret":"..."}
]
```

## SignedArtifact

O modelo `SignedArtifact` registra evidência institucional para:

- `MONTHLY_DOSSIER`
- `EXPORT_PDF`
- `EXPORT_CSV`
- `FINANCIAL_PLAN_SNAPSHOT`
- `RECOMMENDATION_EVIDENCE`
- `PROCESSING_EVIDENCE`

Cada registro inclui hash, assinatura, key id, token de verificação e metadados seguros.

## Verificação pública/segura

- Página: `/verify/[token]`
- API: `/api/artifacts/verify/[token]`

As respostas exibem somente metadados mínimos (tipo, criação, chave, período) e **não** expõem payload financeiro sensível.

## Quotas por household

Modelo `HouseholdQuota` com enforcement para IA por:

- `capability`
- `provider`
- período mensal
- limites de requests/tokens
- `hardBlock` + `warningThresholdPct`

Enforcement aplicado em:

- `POST /api/ai/composer`
- `POST /api/ai/chat`

## Automações

Novo job: `/api/cron/wave4`.

Rotinas:

- geração idempotente de dossiê mensal por household
- snapshot assinado de planos ativos
- leitura de warning de quota
- persistência de saúde operacional em `AutomationJobRun`

## CLI operacional

Comando principal:

```bash
npm run ctrlbank -- <command>
```

Comandos:

- `verify-artifact <token>`
- `export-dossier <householdId> <userId> [year] [month]`
- `snapshot-plan <planId> [actorUserId]`
- `quota-report <householdId> <capability> [provider]`
- `reprocess-processing <correlationId>`
