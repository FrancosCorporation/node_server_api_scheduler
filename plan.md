# Plan — node_server_api_scheduler

## 1. Visão geral
API Node/TypeScript (Express) empacotada para container, com build `tsc`, start sem watcher, Helmet, CORS com allowlist, rota de saúde e healthcheck Docker. README alinhado ao produto.

## 2. Arquitetura e tecnologias
Node **24** (engines `>=24 <25` — decisão de projeto preservada), TypeScript, express 4, helmet, cors, dotenv. CI com typecheck/build/audit/gate de dependências de runtime.

## 3. Funcionalidades existentes
- [x] SEC-01/02, BUG-01/02, IMP-01..04 concluídos (2026-10-11).
- [x] CI — **modernizada nesta sessão** (Ubuntu 24.04, Actions v7 pinadas por SHA; matriz mantida em Node 24 apenas, por decisão de engines do projeto).
- [ ] TEST-01 — suíte automatizada (vedada nesta esteira).

## 4. Objetivos futuros
- OBJ-01 (P2, concluído nesta sessão): pins de CI.
- OBJ-02 (P3): TEST-01 com node:test na API (após liberação).
- OBJ-03 (P3): avaliar requisito `>=24 <25` — pode ser flexibilizado para `>=22.12` se quisermos a mesma matriz dos demais; decisão do dono.

## 5–9. Melhorias/Roadmap/Riscos/Ideias
- Nota: API de scheduler — rotas de agendamento ainda não existem; escopo atual é o alicerce.

*(Gerado em 2026-10-14 pelo agente orquestrador)*
