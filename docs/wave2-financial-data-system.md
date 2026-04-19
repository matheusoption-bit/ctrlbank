# Onda 2 — Stabilization / Financial Data System

## Novos blocos

- `SourceDocument`: identidade canônica da entrada com checksum SHA-256 e escopo seguro.
- `IngestionLog`: trilha append-only por `correlationId`.
- `TransactionQualityFlag`: flags persistentes antes/depois do commit.
- `AiCaptureEvent` v2: estágio, estado de revisão, proveniência, payload selado e assinatura HMAC.

## Parse + staging server-side

`POST /api/inbox/parse` agora:

1. valida autenticação e escopo,
2. gera checksum canônico,
3. cria/reusa `SourceDocument`,
4. cria logs de `RECEIVED` e `PARSED`,
5. persiste staging no `AiCaptureEvent.normalizedDraft`,
6. retorna `captureEventId` + `correlationId` para confirmação segura.

## Confirm idempotente

`POST /api/inbox/confirm` agora exige `captureEventId`.

- Reidrata staging no servidor.
- Não confia em payload de itens reenviado pelo cliente.
- Verifica assinatura HMAC quando presente.
- Bloqueia dupla confirmação usando `IngestionLog(COMMITTED,SUCCESS)`.
- Executa deduplicação por conteúdo e cria flag explícita.

## Processamentos

A página `/processamentos` passa a mostrar:

- correlationId,
- origem/canal,
- status + stage atual,
- timeline de `IngestionLog`,
- flags de qualidade,
- referência de `SourceDocument`.

## Variáveis de ambiente

- `CAPTURE_SIGNING_KEY` (opcional): segredo HMAC para selar payload staged.
- `CAPTURE_SIGNING_KEY_ID` (opcional, default `v1`): versão da chave.

Sem `CAPTURE_SIGNING_KEY`, o sistema mantém compatibilidade e não valida assinatura.
