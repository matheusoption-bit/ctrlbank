# Wave 5 — Continuous Optimization / Adaptive Operations / Product Excellence

## Novos contratos

- `PolicyVersion`: versionamento explícito de políticas com estados (`DRAFT`, `ACTIVE`, `RETIRED`, `ROLLED_BACK`, `EXPERIMENTAL`) e lineage.
- `DecisionEvaluation`: trilha de avaliação com proveniência (`policyVersionId`, provider/model, sourceEventId, score, result).
- `DecisionFeedback`: captura de feedback explícito e inferido (`isInferred`, `signalStrength`) ligado a recomendação, quality flag e evento de captura.
- `ProductQualityMetricSnapshot`: snapshots periódicos das métricas de qualidade para governança.
- `CalibrationRun` + `CalibrationChange`: recomendações/aplicações de calibração com guardrails e histórico.
- `Experiment`: experimento com kill switch, janelas e alocação.

## Estratégia de calibração e guardrails

- Modo padrão: `RECOMMEND_ONLY`.
- Modo opcional: `APPLY_WITH_GUARDRAILS`.
- Guardrails implementados:
  - `minSampleSize` antes de sugerir/aplicar.
  - `maxStepPct` para evitar saltos bruscos.
  - `cooldownHours` para impedir thrashing.
- Rollback seguro via ação operacional (`rollbackActivePolicy`) e engine (`rollbackPolicy`).

## Semântica de feedback

- Explícito:
  - `suggestion_rejected` ao dispensar recomendação.
- Inferido:
  - `suggestion_accepted` quando commit acontece com sucesso.
  - `duplicate_confirmed` quando deduplicação bloqueia item.
- Cada registro de feedback pode ser ligado a policy/version/provider/model.

## Métricas de qualidade de produto

Snapshots incluem, no mínimo:

- `suggestion_acceptance_rate`
- `suggestion_override_rate`
- `review_required_rate`
- `false_positive_review_rate`
- `duplicate_detected_rate`
- `duplicate_false_positive_rate`
- `routing_provider_success_rate`
- `processing_completion_success_rate`
- `decision_quality_score`

## Jobs agendados

- Endpoint: `GET|POST /api/cron/wave5`
- Job `wave5-continuous-optimization`:
  1. gera snapshots diários de qualidade;
  2. roda calibração conservadora de `review_thresholds`;
  3. detecta regressões (ex.: spike de `review_required_rate`);
  4. persiste execução em `AutomationJobRun`.

## Workflow operacional

1. Operador acompanha métricas, políticas ativas, calibrações e experimentos em **Processamentos**.
2. Se necessário, aciona rollback por política.
3. Se experimento degradar confiança, aciona kill switch.
4. Monitoramento contínuo via job Wave 5 e trilhas em `DecisionEvaluation`.
