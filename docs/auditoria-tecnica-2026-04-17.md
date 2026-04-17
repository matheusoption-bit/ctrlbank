# Auditoria técnica do CtrlBank — 2026-04-17

## Escopo
- Revisão estática dos principais fluxos de autenticação, autorização, ações de domínio financeiro, webhooks e qualidade de build.
- Execução de checks automatizados básicos (testes, lint e build).

## Principais achados

### 1) **[CRÍTICO] 2FA implementado, mas não aplicado no login**
**Evidência**
- O endpoint de login autentica apenas e-mail/senha e cria sessão imediatamente.
- A função `verify2FACode` existe, mas não é chamada em nenhum outro lugar do projeto.

**Risco**
- Usuários com `totpEnabled=true` continuam vulneráveis a takeover caso senha seja comprometida.

**Hipótese de solução**
- Evoluir login para fluxo em duas etapas:
  1. validar senha;
  2. se `totpEnabled`, exigir código TOTP antes de `createSession`.
- Adicionar estado temporário de autenticação parcial (cookie curto com nonce) e endpoint de confirmação de 2FA.
- Incluir testes de integração cobrindo caminhos com e sem 2FA.

---

### 2) **[ALTO] Risco de vazamento de dados quando `householdId` é nulo**
**Evidência**
- Em múltiplas consultas de transações, o filtro usa `householdId: ctx.householdId ?? undefined` sem fallback para `userId`.
- Em Prisma, `undefined` remove o filtro, podendo abrir escopo indevido.

**Risco**
- Usuários sem household podem acessar agregações/transações fora do seu escopo esperado, dependendo dos dados existentes.

**Hipótese de solução**
- Introduzir helper central de escopo:
  - se `householdId` existe: filtrar por household;
  - senão: filtrar por `userId`.
- Proibir filtros diretos que expandam escopo (`filters.userId`) para perfis não-admin.
- Criar testes de autorização para contexto com e sem household.

---

### 3) **[ALTO] Ausência de rate limiting em endpoints sensíveis**
**Evidência**
- Login, registro, convite e vinculação de WhatsApp não exibem proteção de taxa por IP/identidade.

**Risco**
- Força bruta de senha, enumeração de contas e tentativa massiva de tokens/códigos.

**Hipótese de solução**
- Aplicar rate limiter por rota (IP + fingerprint + identificador de conta quando aplicável).
- Backoff progressivo e lockout temporário para login.
- Observabilidade: métricas por rota e alertas de pico de tentativas.

---

### 4) **[MÉDIO] Segredo TOTP em texto claro no banco**
**Evidência**
- Campo `totpSecret` é persistido diretamente e utilizado sem cifragem em repouso.

**Risco**
- Exposição do banco implica possibilidade de geração de códigos válidos (quando combinado com outras informações).

**Hipótese de solução**
- Criptografar `totpSecret` com envelope encryption (KMS/secret master), com rotação de chave.
- Separar chave de aplicação e dados (princípio de compartmentalization).

---

### 5) **[MÉDIO] Integridade de domínio parcialmente delegada à aplicação**
**Evidência**
- Entidades financeiras usam relações por id, mas sem constraints compostas explícitas para assegurar coerência household/user entre relacionamentos.

**Risco**
- Bugs de aplicação podem introduzir associações cruzadas inconsistentes (ex.: transação apontando conta/categoria fora do escopo esperado).

**Hipótese de solução**
- Revisar modelo para constraints compostas e/ou validações transacionais no banco.
- Em operações críticas, validar escopo de `bankAccountId` e `categoryId` dentro da mesma transação.

---

### 6) **[MÉDIO] Lint quebrado no estado atual**
**Evidência**
- `npm run lint` falha com erro de diretório inválido ao executar `next lint`.

**Risco**
- Regressões de qualidade passam sem detecção no CI.

**Hipótese de solução**
- Ajustar script para estratégia compatível com Next 16 + ESLint 9 (ex.: `eslint .`).
- Consolidar configuração e tornar lint obrigatório no pipeline.

---

### 7) **[BAIXO/MÉDIO] Build sensível à rede por fonte externa**
**Evidência**
- Build falha ao buscar fonte Inter via `next/font` em ambiente sem acesso ao Google Fonts.

**Risco**
- Quebra de build em CI/CD restrito ou ambientes corporativos.

**Hipótese de solução**
- Self-host de fontes (local) ou fallback robusto sem fetch externo em build.

---

### 8) **[BAIXO] Dívida técnica de compatibilidade Next.js**
**Evidência**
- Aviso de depreciação do arquivo `middleware` (migração para `proxy`).

**Risco**
- Acúmulo de breaking changes em upgrades futuros.

**Hipótese de solução**
- Planejar migração para convenção recomendada e validar comportamento de autenticação no edge/runtime.

## Qualidade de código e manutenção
- Uso frequente de `any` em fluxos de IA e parsing aumenta risco de erro em runtime.
- Há repetição de lógica de escopo/autorização em várias actions; oportunidade para camada comum de policy enforcement.

## Plano de priorização recomendado
1. **Semana 1 (hotfix segurança):** aplicar 2FA no login, rate limiting, corrigir escopo household/user em transações.
2. **Semana 2:** endurecer modelagem de integridade e testes de autorização multi-tenant.
3. **Semana 3:** corrigir lint/build resiliente e reduzir `any` nos pontos críticos.

## Checks executados
- `npm test` ✅ (51 testes passados)
- `npm run lint` ❌ (script/config incompatível no estado atual)
- `npm run build` ⚠️ (falha por dependência de rede ao buscar Google Fonts)
- `npm audit --omit=dev` ⚠️ (endpoint de advisories bloqueado no ambiente)
