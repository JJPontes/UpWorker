# UpWorker API

Backend Node.js/Express/TypeScript para o sistema UpWorker.

## Principais Recursos

- CRUD de usuários e chamados
- Autenticação JWT
- Persistência real no PostgreSQL
- Documentação Swagger em `/api-docs`
- Modularização por routers (auth, users, calleds, bugAnalyze)
- Separação controller/repository
- Integração via Docker Compose

## Como rodar

### Local

1. Instale dependências: `yarn install` ou `npm install`
2. Configure o banco PostgreSQL local (veja `.env`)
3. Rode: `yarn dev` ou `npm run dev`

### Docker Compose

1. Configure variáveis em `.env.docker` se necessário
2. Rode: `docker compose up -d`

## Documentação

- Swagger: [http://localhost:3010/api-docs](http://localhost:3010/api-docs)
- Arquitetura: veja `docs/backend/arquitetura_backend.md`

## Estrutura

- `src/` - código fonte
- `routes/` - routers Express
- `controllers/` - regras de negócio
- `repositories/` - integração com banco
- `models/` - modelos de dados
- `db.ts` - conexão PostgreSQL

## Exemplos de Uso (prefixo /api)

```http
POST /api/users
{
	"nome": "João",
	"email": "joao@exemplo.com",
	"senha": "123456",
	"perfil": "Analista"
}

POST /api/auth/login
{
	"email": "joao@exemplo.com",
	"senha": "123456"
}

POST /api/bugAnalyze
{
	"description": "Ao clicar em salvar, o sistema retorna erro 500."
}
```

## Observações

- Tabelas do banco são criadas automaticamente ao subir o container
- Perfis de usuário: Analista, Executor
- Listagem de chamados suporta paginação
