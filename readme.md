# node_server_api_scheduler

Esqueleto de API REST em Node.js, TypeScript e Express. O projeto ainda **não implementa um agendador de tarefas**: hoje fornece uma rota de exemplo e uma rota de saúde para servir de base ao desenvolvimento.

## Requisitos

- Node.js 24 LTS
- npm 11 (incluído no Node.js 24)

Use o arquivo .nvmrc para selecionar Node 24 com nvm. O arquivo .env.example lista as opções de configuração; copie os valores necessários para .env antes de iniciar. O servidor carrega .env automaticamente.

## Desenvolvimento

~~~sh
npm ci
npm run dev
~~~

O servidor usa 127.0.0.1 e a porta 3333 por padrão. Configure HOST e PORT para mudar o endereço. Alterações TypeScript são recarregadas pelo tsx.

## Rotas atuais

| Método | Caminho | Uso |
|---|---|---|
| GET | / | Informa que a API está em construção e que o agendador ainda não existe |
| GET | /healthz | Healthcheck sem dependências externas |

A raiz responde JSON com status skeleton. Caminhos desconhecidos respondem 404 em JSON.

## Configuração

| Variável | Padrão | Descrição |
|---|---|---|
| NODE_ENV | — | Ambiente de execução |
| HOST | 127.0.0.1 | Interface local; o Docker define 0.0.0.0 |
| PORT | 3333 | Porta HTTP, de 1 a 65535 |
| CORS_ORIGINS | vazio | Lista opcional de origens HTTP(S), separadas por vírgula; vazio bloqueia CORS cross-origin |

CORS não habilita credenciais. Requisições sem cabeçalho Origin, como chamadas server-to-server, continuam aceitas.

## Build e produção

~~~sh
npm ci
npm run typecheck
npm run build
npm ci --omit=dev
npm start
~~~

O build TypeScript é escrito em dist/. O processo de produção executa apenas o JavaScript compilado e depende de packages de runtime.

## Docker

~~~sh
docker build -t node-server-api-scheduler .
docker run --rm -p 3333:3333 node-server-api-scheduler
~~~

A imagem compila em estágio separado, instala apenas dependências de runtime, executa como usuário node e verifica /healthz.

## CI e segurança

O workflow valida instalação, verificação de tipos, build, auditoria de dependências e disponibilidade dos pacotes de runtime sem instalar dependências de desenvolvimento. O projeto ainda não possui testes automatizados.

Helmet aplica headers de segurança. Esta API não possui autenticação, banco de dados nem execução de tarefas; não a use como serviço de agendamento em produção. Consulte SECURITY.md para reportar vulnerabilidades.

## Estrutura

- src/app.ts: middleware e rotas Express.
- src/config/env.ts: leitura e validação de ambiente.
- src/server.ts: inicialização HTTP e encerramento gracioso.
- MELHORIAS.md: plano e estado da implementação.
- instructions_since_initial.md: nota histórica sobre a criação em 2021.

## Licença

MIT; veja LICENSE.
