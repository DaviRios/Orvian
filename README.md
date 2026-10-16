# Orvian

Plataforma institucional de gestão de conteúdo, criada em Node.js e TypeScript.

**Autoria:** Davi Rios

## Estado atual

O Orvian é um CMS funcional com painel administrativo responsivo, API pública e persistência relacional. O frontend usa carregamento por rota e cache de dados; o backend é modular e não depende de outro repositório para executar.

| Área | Recursos disponíveis |
| --- | --- |
| Administração | login, renovação de sessão, dashboard, busca de módulos e navegação responsiva |
| Conteúdo Site | produtos, parceiros/banner, logos, saiba mais/informações e links |
| Feedbacks | avaliações, imagens, depoimentos e feedbacks de clientes |
| Editorial | posts de blog e autores |
| Institucional | mídias da página Sobre, parceiros, carreiras e serviços |
| Mídia | upload e catálogo de imagens, vídeos e arquivos, com armazenamento local ou S3 |
| Documentos legais | Política de Privacidade e Termos de Serviço em português e inglês |
| Entrega pública | endpoints que retornam apenas conteúdo ativo e publicado |

O ciclo editorial é consistente entre os domínios: um registro novo começa como `DRAFT` e `isActive=true`; publicar muda o estado para `PUBLISHED`; excluir realiza soft delete (`isActive=false` e `deletedAt` preenchido). Registros removidos permanecem no banco. Mídias e autores referenciados não podem ser excluídos e retornam HTTP 409.

## Arquitetura

- API: Fastify 5, Zod e OpenAPI;
- frontend: React 19, Vite, Tailwind CSS 4, TanStack Query, React Hook Form e TipTap;
- persistência: PostgreSQL com tabelas relacionais gerenciadas pelo Prisma;
- autenticação: access token JWT curto em cookie `HttpOnly` e refresh token opaco com rotação;
- mídia: porta de armazenamento com adaptadores para diretório local e S3;
- monorepo: Nx 23.

Os módulos de backend separam rotas, serviços de aplicação e contratos de repositório. A composição com Prisma e armazenamento acontece em `apps/back/src/app.ts`; domínio e serviços não dependem do antigo documento JSONB.

```text
apps/back       API Fastify, casos de uso e adaptadores Prisma/S3/local
apps/front      painel React e serviços HTTP
libs/contracts  contratos Zod e tipos compartilhados
prisma          schema relacional e migrations
tools           execução local e importação do formato legado
```

## Execução local com Docker

Requisito: Docker Desktop com Docker Compose. O ambiente executa frontend, backend, migrations e PostgreSQL em containers. O `compose.yaml` fornecido é destinado exclusivamente ao desenvolvimento local: suas credenciais padrão são públicas e não devem ser reutilizadas em produção.

```bash
copy .env.example .env
docker compose up --build
```

- Painel: <http://localhost:4200>
- API: <http://localhost:3000/v1>
- Health check: <http://localhost:3000/v1/health>
- Documentação OpenAPI: <http://localhost:3000/docs>
- PostgreSQL no host: `localhost:5433`

O Compose monta o código-fonte dentro dos containers e mantém hot reload no Vite e no backend. A migration `deploy` é executada automaticamente depois que o PostgreSQL fica saudável e antes da API iniciar. Dentro da rede Docker, a API conecta em `postgres:5432`; a porta `5433` é usada apenas para acesso a partir do Windows e evita conflito com uma instalação local do PostgreSQL.

`Ctrl+C` encerra a execução anexada. Para remover os containers e a rede, execute `docker compose down` (ou `npm run docker:down` quando o Node.js estiver instalado). Os dados do PostgreSQL, uploads e dependências permanecem em volumes nomeados.

## Execução sem Docker

Requisitos: Node.js 22.18+ ou 24+, npm e PostgreSQL acessível pela `DATABASE_URL`.

```bash
npm install
npm run db:migrate:deploy
npm run dev
```

O comando `npm run dev` usa dois processos independentes e propaga `Ctrl+C` para ambos.

Credenciais iniciais de desenvolvimento:

```text
E-mail: valor de `ORVIAN_ADMIN_EMAIL`
Senha:  valor de `ORVIAN_ADMIN_PASSWORD`
```

Defina um `ORVIAN_ADMIN_PASSWORD` próprio antes da primeira execução e um `JWT_SECRET` aleatório com pelo menos 32 caracteres. O usuário administrador só é criado quando a tabela de usuários está vazia.

## Comandos

```bash
npm run dev                 # API e painel; Ctrl+C encerra ambos
npm run dev:back            # somente API
npm run dev:front           # somente painel
npm run docker:up           # constrói e inicia front, back, migrations e PostgreSQL
npm run docker:down         # remove containers e rede; preserva volumes
npm run docker:logs         # acompanha os logs dos containers
npm run build               # builds de produção
npm test                    # testes unitários/frontend e integração via inject
npm run typecheck           # TypeScript strict
npm run lint                # ESLint, incluindo regras de hooks
npm run db:up               # inicia somente o PostgreSQL em localhost:5433
npm run db:down             # para somente o PostgreSQL do Compose
npm run db:generate         # gera o Prisma Client
npm run db:migrate          # cria/aplica migration de desenvolvimento
npm run db:migrate:deploy   # aplica migrations existentes
npm run db:import-legacy    # importa data/cms.json sem apagá-lo
npm run db:studio           # Prisma Studio
```

Os testes de integração não abrem nem alteram banco algum: usam `Fastify.inject()` e repositórios em memória.

## Configuração

| Variável                | Padrão                  | Uso                                    |
| ----------------------- | ----------------------- | -------------------------------------- |
| `PORT`                  | `3000`                  | porta da API                           |
| `APP_ORIGIN`            | `http://localhost:4200` | origem aceita para mutações            |
| `LOG_LEVEL`             | `warn`                  | nível de log no desenvolvimento        |
| `DATABASE_URL`          | obrigatória             | conexão PostgreSQL                     |
| `POSTGRES_PORT`         | `5433`                  | porta PostgreSQL exposta no host       |
| `JWT_SECRET`            | obrigatória             | assinatura do access token             |
| `ORVIAN_ADMIN_USER`     | `admin`                 | usuário inicial                        |
| `ORVIAN_ADMIN_EMAIL`    | `admin@orvian.local`    | e-mail inicial                         |
| `ORVIAN_ADMIN_PASSWORD` | obrigatório             | senha inicial (mínimo de 8 caracteres) |
| `MEDIA_STORAGE`         | `local`                 | `local` ou `s3`                        |
| `ORVIAN_UPLOAD_DIR`     | `data/uploads`          | raiz do adaptador local                |
| `S3_REGION`             | `us-east-1`             | região S3                              |
| `S3_BUCKET`             | —                       | bucket obrigatório no modo S3          |
| `S3_ENDPOINT`           | —                       | endpoint compatível com S3, opcional   |
| `S3_ACCESS_KEY_ID`      | —                       | credencial opcional                    |
| `S3_SECRET_ACCESS_KEY`  | —                       | credencial opcional                    |
| `S3_FORCE_PATH_STYLE`   | `false`                 | compatibilidade com MinIO e similares  |

Variáveis incorporadas ao build do frontend:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `VITE_API_ORVIAN_URL` | `/v1` | base HTTP consumida pelo painel |
| `VITE_SKIP_AUTH` | `false` | simula o usuário somente na interface durante desenvolvimento; não remove a proteção da API |

No desenvolvimento padrão, o proxy do Vite encaminha `/v1` para `http://localhost:3000`.

Em produção, prefira publicar painel e API sob a mesma origem por meio de um proxy reverso. O backend atualmente valida `APP_ORIGIN` para requisições mutáveis, mas não registra CORS para uso direto entre origens diferentes.

## Segurança

Controles implementados:

- senhas armazenadas com Argon2;
- access token JWT com duração de 15 minutos em cookie `HttpOnly`;
- refresh token opaco com duração de 7 dias, armazenado no banco somente como hash, rotacionado na renovação e revogado no logout;
- cookies com `SameSite=Strict` e `Secure` quando `NODE_ENV=production`;
- autorização por papéis `ADMIN` e `EDITOR`, com confirmação de que o usuário continua ativo em cada rota protegida;
- validação de entrada e saída com Zod e schemas OpenAPI;
- verificação de origem nas operações mutáveis;
- limites de upload de 20 arquivos, 25 MB por arquivo e 60 partes por requisição;
- PostgreSQL, API e painel publicados apenas em `127.0.0.1` pelo Compose de desenvolvimento;
- `.env`, variantes locais de ambiente, uploads, dados locais, logs e o Prisma Client gerado excluídos do Git e do contexto de build Docker.

Pendências antes de uma publicação em produção:

- substituir todas as credenciais padrão do Compose e usar um gerenciador de segredos;
- executar com HTTPS e `NODE_ENV=production` para ativar cookies `Secure`;
- não publicar a porta do PostgreSQL na internet;
- adicionar rate limiting, especialmente no login e na renovação de sessão;
- adicionar headers HTTP de segurança, como CSP e HSTS, no Fastify ou no proxy reverso;
- restringir ou desabilitar `/docs` caso a documentação OpenAPI não deva ser pública;
- ampliar os padrões de ignore caso sejam usados arquivos como `.env.production` ou `.env.staging`;
- adicionar varredura automática de segredos e dependências no CI;
- considerar controle de concorrência otimista para impedir que duas edições simultâneas do mesmo registro sobrescrevam uma à outra.

Nunca coloque valores reais em `.env.example`, `compose.yaml` ou arquivos versionados. Se um segredo for commitado, removê-lo do arquivo não é suficiente: revogue/rotacione a credencial e então trate o histórico Git.

## Rotas

Rotas administrativas usam os cookies seguros criados por `POST /v1/users/auth`. O cliente renova automaticamente o access token por `POST /v1/users/auth/refresh`.

| Recurso                | Base                  |
| ---------------------- | --------------------- |
| Autenticação           | `/v1/users/auth`      |
| Produtos               | `/v1/products`        |
| Saiba mais/informações | `/v1/information`     |
| Parceiros/Banner       | `/v1/partner-banners` |
| Links                  | `/v1/links`           |
| Avaliações             | `/v1/reviews`         |
| Feedbacks              | `/v1/feedbacks`       |
| Blog                   | `/v1/blog-posts`      |
| Autores                | `/v1/authors`         |
| Imagens                | `/v1/images`          |
| Vídeos                 | `/v1/videos`          |
| Mídias Sobre           | `/v1/about-media`     |
| Parceiros              | `/v1/partners`        |
| Carreiras              | `/v1/careers`         |
| Serviços               | `/v1/services`        |
| Documentos legais      | `/v1/legal-documents` |

Rotas públicas:

```text
GET /v1/public/pages/home?language=PORTUGUESE
GET /v1/public/pages/feedbacks?language=PORTUGUESE
GET /v1/public/pages/about
GET /v1/public/pages/blog?language=PORTUGUESE
GET /v1/public/pages/privacy-policy?language=PORTUGUESE
GET /v1/public/pages/terms-of-service?language=PORTUGUESE
```

## PostgreSQL e mídia

A migration em `prisma/migrations` cria tabelas por domínio, índices e chaves estrangeiras. Não existe uma linha JSONB central nem cache global mutável no backend, portanto múltiplas instâncias podem compartilhar o mesmo PostgreSQL com consistência.

Se houver dados do formato anterior em `data/cms.json`, execute `npm run db:import-legacy` depois da migration. O importador é idempotente por ID, mantém o arquivo original e deve ser executado antes de começar novas edições.

Metadados de mídia ficam em `media_assets`; binários ficam no adaptador configurado. O soft delete não remove o arquivo físico, mantendo a política de retenção definida para o projeto.
