# MELHORIAS — node_server_api_scheduler

> **Gerado por análise de código em 2026-10-02** · Stack: Node + TypeScript + Express (**10 linhas de código**)
> Branch (master/main) · base 21/09 · **10 LOC** · 0 testes · sem CI
>
> **Este arquivo é um plano de execução.** Cada item tem ID, `arquivo:linha`, mudança exata,
> critério de aceite e comando de verificação.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. **O README promete "API com agendador de tarefas"** — mas não há agendador. O código é **uma rota
   só** que devolve uma string fixa (`src/server.ts:6-8`). Não há o que explorar hoje; os itens
   são de **fundação** antes de existir o produto.
4. **Idioma:** português.

---

## 1. Diagnóstico executivo

Um arquivo, `src/server.ts` (10 linhas): sobe Express na porta **3333** fixa e devolve
`{message: "e ai cara, ..."}` em `GET /`. É o "hello world" de um projeto cujo nome promete
agendador.

**O que está bom (não reaça):**

| Item | Evidência |
|---|---|
| TypeScript com `ts-node-dev` e watch | `package.json:9-10` |
| Dependências **mínimas** (2) | `package.json:12-15` |
| Resposta em JSON (não string solta) | `server.ts:6-8` |
| Código legível e sem的最优 path | 10 linhas |

**O que está quebrado:**

1. **`express` está em `devDependencies`** (`package.json:16-18`) — é dependência de **runtime**.
   Com `npm ci --omit=dev` (produção), o `require('express')` **falha** e a API não sobe.
2. **Porta fixa `3333`** (`server.ts:3`) — sem `process.env.PORT`.
3. **Sem tratamento de erro** no `app.listen` e sem shutdown gracioso.
4. **Sem o agendador** que o README descreve.

---

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Depende de |
|---|---|---|---|---|
| SEC-01 | `express` em `devDependencies` — produção não sobe | **P0** | `package.json:16-18` | — |
| SEC-02 | Porta fixa, sem `env` | **P1** | `src/server.ts:3` | — |
| BUG-01 | `ts-node-dev` em runtime + `typescript` em `dependencies` | **P1** | `package.json:12-15` | SEC-01 |
| BUG-02 | Sem tratamento de erro no listen / shutdown gracioso | **P1** | `src/server.ts:10` | — |
| IMP-01 | README promete agendador; não existe | **P1** | `README.md` | — |
| IMP-02 | Sem `helmet`/headers (armadilha quando crescer) | **P2** | `src/server.ts` | — |
| IMP-03 | Sem healthcheck | **P2** | *(ausente)* | — |
| IMP-04 | Sem CORS explícito (armadilha futura) | **P2** | `src/server.ts` | — |
| TEST-01 | Zero testes | **P1** | *(ausente)* | — |
| DEVOPS-01 | Sem CI | **P2** | *(ausente)* | — |
| DEVOPS-02 | Sem Dockerfile | **P2** | *(ausente)* | SEC-01 |
| DEVOPS-03 | Sem `.env.example` | **P3** | *(ausente)* | SEC-02 |
| DEVOPS-04 | `main` apontando para `src/` (TS) — impede build | **P2** | `package.json:4` | — |
| DOC-01 | README descreve um produto que não existe | **P2** | `README.md` | IMP-01 |
| DOC-02 | Falta `SECURITY.md` | **P3** | *(ausente)* | — |

**Placar: 1 P0 · 6 P1 · 6 P2 · 2 P3 = 15 itens.**

---

## 3. Segurança

### SEC-01 · `express` em `devDependencies` — produção não sobe · [P0]

- **Arquivo:** `package.json:16-18`
- **Evidência:** `devDependencies` contém `express: ^4.17.1` e `tsconfig-paths`. `dependencies` (linhas
  12-15) só tem `ts-node-dev` e `typescript`.
- **Impacto:** **a aplicação não funciona em produção.** `npm ci --omit=dev` (padrão de imagem
  Docker/CI) **não instala** `express` → `import express from "express"` (linha 1) falha → o processo
  morre. É o tipo de erro que só aparece no deploy.
- **Mudança:** (1) mover `express` para `dependencies`; (2) `tsconfig-paths` é só dev (fica);
  (3) `ts-node-dev`/`typescript` são **build/dev** (ver `BUG-01`); (4) validar o bundle de produção
  de verdade (`npm ci --omit=dev && npm start`).
- **Aceite:** com `npm ci --omit=dev`, `npm start` sobe e `GET /` responde `200`.
- **Verificação:**
  ```bash
  rm -rf node_modules && npm ci --omit=dev
  npm start &   # deve subir
  curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3333/   # 200
  ```

### SEC-02 · Porta fixa, sem `env` · [P1]

- **Arquivo:** `src/server.ts:3`
- **Evidência:** `const port = 3333;` (fixo).
- **Impacto:** (a) **colisão de porta** em máquina com mais de um serviço (o repo usa 3000, 3111, 3200,
  3300, 3400…); (b) em container/produção, a porta precisa ser injetada (Plataforma/Heroku) — fixo
  impede; (c) qualquer mudança de porta exige rebuild.
- **Mudança:** `const port = Number(process.env.PORT) || 3333;`
- **Aceite:** `PORT=8080 npm start` sobe em 8080.
- **Verificação:**
  ```bash
  PORT=8080 npm start & sleep 2; curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/
  ```
DEOF
wc -l MELHORIAS.md

---

## 4. Bugs e defeitos funcionais

### BUG-01 · `ts-node-dev`/`typescript` em `dependencies` · [P1]

- **Arquivo:** `package.json:12-15`
- **Evidência:** `dependencies` = `ts-node-dev ^1.1.8` + `typescript ^4.3.5`; `devDependencies` = `express`
  + `tsconfig-paths`. Está **invertido**: o que roda em produção (express) é dev, e o que só compila
  (ts-node-dev, typescript) é produção.
- **Impacto:** (a) imagem de produção inclui o compilador TypeScript inteiro (peso morto); (b)
  `start` usa `ts-node-dev` (servidor de **desenvolvimento** com watch) — em produção, qualquer
  edição de arquivo **reinicia o processo**; (c) nenhum `tsconfig` de **build** — o `main` aponta
  para o `.ts` (ver `DEVOPS-04`).
- **Mudança:** (1) `dependencies` = só o que o runtime precisa (`express`); (2) mover
  `ts-node-dev`/`typescript`/`tsconfig-paths` para `devDependencies`; (3) **build real** com `tsc` →
  `dist/`, e `start` = `node dist/server.js`; (4) `dev` continua com `ts-node-dev`.
- **Aceite:** `npm ci --omit=dev && npm start` sobe **sem** watcher, servindo `dist/`.
- **Verificação:**
  ```bash
  npm ci && npm run build          # gera dist/
  npm ci --omit=dev && npm start & # sobe sem ts-node-dev
  curl -s http://localhost:3333/   # {"message":"..."}
  ```

### BUG-02 · Sem tratamento de erro no listen / shutdown gracioso · [P1]

- **Arquivo:** `src/server.ts:10`
- **Evidência:** `app.listen(port, ()=>{console.log(...)})` — sem callback de `error` (EADDRINUSE
  engole), sem `SIGTERM`/`SIGINT`.
- **Impacto:** (a) **EADDRINUSE silencioso**: se a porta 3333 estiver ocupada (ver `SEC-02` —
  provável, é porta usada na conta), o processo **não sai** e não loga — o `console.log` do callback
  de sucesso **nunca** roda, mas o processo fica "vivo" sem fazer nada; (b) `docker stop` corta
  conexões abruptamente; (c) o `listen` pode lançar e aUnhandled rejection mata o processo sem log.
- **Mudança:** (1) `const server = app.listen(port, () => console.log(...))`; (2)
  `server.on('error', e => { console.error(...); process.exit(1); })`; (3)
  `process.on('SIGTERM', () => server.close(() => process.exit(0)))` (idem `SIGINT`).
- **Aceite:** porta ocupada → processo sai com mensagem clara; SIGTERM fecha limpo.
- **Verificação:**
  ```bash
  npm start & sleep 2; npm start   # segunda instancia deve sair com erro de EADDRINUSE, nao ficar muda
  ```

---

## 5. Qualidade: testes

### TEST-01 · Zero testes · [P1]

- **Arquivo:** *(ausente)*
- **Evidência:** nenhum arquivo de teste, sem script `test` no `package.json`.
- **Impacto:** uma rota só, mas **sem** rede de segurança. Quando o agendador (o produto prometido)
  for implementado, não há o que travar regressão — e agendador é código com **efeito de tempo**
  (roda coisa em background), que é o tipo que mais bugga silenciosamente.
- **Mudança:** (1) `node --test` + `supertest` (mesmo padrão dos projetos novos da conta);
  (2) smoke: `GET /` → `200` e corpo JSON; (3) quando houver agendador: teste de **tempo**
  (fake timer/agendador falso) para não esperar minutos em teste.
- **Aceite:** `npm test` roda e passa; CI falahou se a rota quebrar.
- **Verificação:**
  ```bash
  npm test
  ```

---

## 6. DevOps / Infra

### DEVOPS-04 · `main` aponta para `src/` (TS) — impede build · [P2]

- **Arquivo:** `package.json:4`
- **Evidência:** `"main": "src/server.ts"` — o **entrypoint** é o fonte TypeScript, não o JavaScript
  compilado.
- **Impacto:** quem `npm install` este pacote (ou uma ferramenta que leia `main`) tenta executar
  `.ts` e falha (sem loader). Também evidencia que **não há build** (ligado ao `BUG-01`).
- **Mudança:** (1) compilar para `dist/` e apontar `main` para `dist/server.js`; (2) `files: ["dist"]`
  no `package.json`.
- **Aceite:** `main` aponta para `.js` compilado; `npm pack` leva só `dist/`.
- **Verificação:**
  ```bash
  node -e "console.log(require('./package.json').main)"   # dist/server.js
  ```

### DEVOPS-01 · Sem CI · [P2]

- **Arquivo:** *(ausente)* `.github/workflows/`
- **Evidência:** sem workflow.
- **Impacto:** nada garante que `npm ci` (com ou sem `--omit=dev`) funciona — exatamente o que o
  `SEC-01` pegaria.
- **Mudança:** `ci.yml` com: `npm ci`, `npm run build`, `npm test`, e `npm ci --omit=dev && npm start`
  (smoke de produção).
- **Aceite:** PR que quebra runtime é bloqueado.
- **Verificação:**
  ```bash
  npm ci && npm run build && npm test
  ```

### DEVOPS-02 · Sem Dockerfile · [P2]

- **Arquivo:** *(ausente)* `Dockerfile`
- **Evidência:** não há container (o `README` é do acervo).
- **Impacto:** sem `Dockerfile`, o `SEC-01`/`BUG-01` (deps) não são validados no formato que vai a
  produção.
- **Mudança:** `Dockerfile` multi-stage — build `tsc` → `npm ci --omit=dev` → `node dist/server.js`,
  `USER node`, `EXPOSE 3333`, `HEALTHCHECK`.
- **Aceite:** `docker build` + `run` sobe e `GET /` responde `200`.
- **Verificação:**
  ```bash
  docker build -t sched . && docker run --rm -e PORT=3333 -p 3333:3333 sched &
  curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3333/
  ```

### DEVOPS-03 · Sem `.env.example` · [P3]

- **Arquivo:** *(ausente)* `.env.example` · `src/server.ts:3` (após `SEC-02`)
- **Evidência:** nenhuma variável hoje; após `SEC-02`, `PORT`.
- **Impacto:** trivial hoje.
- **Mudança:** `.env.example` com `PORT=3333` (e o que vier com o agendador).
- **Aceite:** exemplo versionado.
- **Verificação:** `ls .env.example`

---

## 7. Documentação

### IMP-01 · README promete agendador; não existe · [P1]

- **Arquivo:** `README.md`
- **Evidência:** o `package.json:20` descreve "API com agendador de tarefas em Node/TypeScript", e o
  README diz o mesmo. Mas `src/server.ts` (10 linhas) é só `GET /` devolvendo texto fixo.
- **Impacto:** quem chega (ou a outra IA) espera um agendador e **não existe** — o projeto parece
  pronto e não está. É documentação enganosa, que é pior que ausência.
- **Mudança:** (1) declarar no README que hoje é **esqueleto** (uma rota de exemplo) e que o
  agendador é o **próximo passo**; (2) linkar este plano como o roteiro; (3) quando implementar,
  atualizar com uso real.
- **Aceite:** README diz o estado real e aponta o plano.
- **Verificação:** `grep -n 'esqueleto\|próximo passo\|não implementado' README.md`.

### DOC-01 · README descreve um produto que não existe · [P2]

- **Arquivo:** `README.md`
- **Evidência:** mesma de `IMP-01` (seção separada para o doc de uso/install).
- **Impacto:** ver `IMP-01`.
- **Mudança:** unificar com `IMP-01` (não duplicar item): README com "Estado atual" + "Como rodar"
  (`npm ci && npm start`, e a variável `PORT`).
- **Aceite:** "Como rodar" funciona do zero.
- **Verificação:** seguir o README em máquina limpa → API responde.

### DOC-02 · Falta `SECURITY.md` · [P3]

- **Arquivo:** *(ausente)* `SECURITY.md`
- **Evidência:** sem `LICENSE` também (só `package.json` com `"license": "MIT"`).
- **Impacto:** baixo hoje; quando crescer, falta política.
- **Mudança:** criar com canal + invariante "dependência em `dependencies` só quando é runtime"
  (a lição do `SEC-01`).
- **Aceite:** arquivo existe.
- **Verificação:** `ls SECURITY.md`

---

## 8. Ordem de execução (waves)

### Wave 1 — Fazer funcionar em produção (P0/P1)
1. **`SEC-01`** — `express` para `dependencies`.
2. **`BUG-01`** — mover `ts-node-dev`/`typescript` para dev, **build real** com `tsc` → `dist/`.
3. **`BUG-02`** — tratamento de erro no listen + shutdown gracioso.
4. **`SEC-02`** — `PORT` por env.
5. **`TEST-01`** — teste de smoke (travando a runtime).

> Depois da Wave 1, `npm ci --omit=dev && npm start` sobe de verdade — que hoje **não** sobe.

### Wave 2 — Fundação segura (P1/P2)
6. **`IMP-01`** — README honesto (esqueleto, não agendador).
7. **`DEVOPS-04`** — `main` para `dist/server.js`.
8. **`DEVOPS-01`** — CI (incluindo smoke de produção).
9. **`IMP-02`**, **`IMP-03`**, **`IMP-04`** — `helmet`, healthcheck, CORS.

### Wave 3 — Operação (P2/P3)
10. **`DEVOPS-02`** — Dockerfile; **`DEVOPS-03`** — `.env.example`.
11. **`DOC-01`**, **`DOC-02`**.

**Dependências que não podem ser invertidas:**
`SEC-01` **antes** de `TEST-01` (o teste de produção usa `--omit=dev`) · `BUG-01` antes de
`DEVOPS-04` (o `main` só faz sentido pós-build) · `SEC-02` antes de `DEVOPS-03` (exemplo usa a
variável) · `IMP-03` (healthcheck) depois que houver rota estável.

---

## 9. Fora de escopo / riscos

| Item | Decisão | Motivo |
|---|---|---|
| Implementar o agendador | **Não** | É o produto — feature, não correção. `IMP-01` alinha a documentação. |
| Migrar para Fastify/Nest | **Não** | 10 linhas; Express basta. |
| Adicionar banco | **Não** | O agendador vai precisar, mas é feature. |
| Adicionar auth | **Não, ainda** | Sem rota protegida. Registrado o caminho em `IMP-02`. |

**Riscos desta execução:**

- **`BUG-01` (build `tsc`) exige `tsconfig.json` válido** — verifique que ele tem `outDir`/`rootDir`
  corretos antes; se não, ajuste junto.
- **`SEC-02` (PORT por env)** pode colidir com outro serviço da conta se usar default 3333
  unchanged — mantenha 3333 como default (não quebra) mas documente.
- **`IMP-02` (helmet) em API que vai expor agendamento** é o momento certo de instalar; não espere
  ter dados sensíveis.

---

## 10. Definição de pronto (DoD)

**Segurança**
- [ ] `SEC-01` — `express` em `dependencies`; `npm ci --omit=dev && npm start` sobe
- [ ] `SEC-02` — `PORT` por env; `PORT=8080` sobe em 8080

**Funcional**
- [ ] `BUG-01` — `tsc` → `dist/`; `start` sem watcher; `typescript`/`ts-node-dev` em dev
- [ ] `BUG-02` — EADDRINUSE sai com erro claro; SIGTERM fecha limpo

**Testes e infra**
- [ ] `TEST-01` — `npm test` com smoke de `GET /`
- [ ] `DEVOPS-01` — CI com build + teste + smoke de produção
- [ ] `DEVOPS-02` — Dockerfile sobe e responde
- [ ] `DEVOPS-03` — `.env.example` com `PORT`
- [ ] `DEVOPS-04` — `main` → `dist/server.js`
- [ ] `IMP-02` — headers do `helmet` presentes
- [ ] `IMP-03` — healthcheck responde
- [ ] `IMP-04` — CORS explícito (ou documentado como same-origin)

**Documentação**
- [ ] `IMP-01` — README diz que é esqueleto (não agendador)
- [ ] `DOC-01` — "Como rodar" funciona do zero
- [ ] `DOC-02` — `SECURITY.md`

**Validação final:**
```bash
npm ci --omit=dev && npm start &     # sobe (o que hoje nao sobe)
curl -s http://localhost:3333/         # {"message":"..."}
npm test
```

---

*Fim do plano. Gerado por leitura direta do código em 2026-10-02 (10 linhas de código). Nenhum item já
estava corrigido.*
