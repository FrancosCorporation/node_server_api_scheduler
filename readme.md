# node_server_api_scheduler

**Projeto de estudo** — esqueleto de API REST em Express + TypeScript criado para praticar a configuração de um servidor Node com reload automático, em julho de 2021.

![TypeScript](https://img.shields.io/badge/TypeScript-4-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Status](https://img.shields.io/badge/status-projeto%20de%20estudo-blue)

## Sobre

Primeiro passo de uma ideia de API de agendamentos: um servidor Express mínimo com TypeScript, script de desenvolvimento com `ts-node-dev` (respawn + transpile-only + `tsconfig-paths`) e um endpoint de teste. O repositório guarda também o guia de instalação passo a passo original em `instructions_since_initial.md`. É um **projeto de estudo**, sem regras de negócio implementadas.

## Funcionalidades

Comprovadas pelo código:

- `GET /` respondendo JSON com uma mensagem de teste (`src/server.ts`);
- Servidor na porta `3333`;
- Script `yarn dev` com reload automático (`ts-node-dev` + `tsconfig-paths`);
- Guia de setup documentado em `instructions_since_initial.md` (instalação de Node, Yarn, TypeScript, ts-node-dev e Express).

## Stack

- **Node.js + Express 4**
- **TypeScript 4**
- **ts-node-dev** e **tsconfig-paths** (desenvolvimento)

## Como rodar

```bash
yarn install
yarn dev
```

Resposta esperada em `http://localhost:3333`:

```json
{ "message": "e ai cara, agora vai pra valer certo?" }
```

Não há variáveis de ambiente obrigatórias (`.gitignore` já prevê `.env` para o futuro).

## Estrutura do projeto

```
.
├── instructions_since_initial.md   # guia de criação do projeto, passo a passo
├── package.json
├── tsconfig.json
└── src/
    └── server.ts                   # Express + GET /
```

## Observações

- O `package.json` classifica `express` como devDependency — funciona para o estudo, mas em produção deveria estar em `dependencies`.
- Projeto privado no GitHub; mantido como registro de aprendizado.

## Licença

MIT — veja [LICENSE](LICENSE).
