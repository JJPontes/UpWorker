# UpWorker API

Backend Node.js/Express/TypeScript para o sistema UpWorker.

## Testes Automatizados e Coverage

- Todos os testes estão organizados em `src/__tests__` por tipo:
	- `controller/` para controllers
	- `repository/` para repositories
	- `middlewares/` para middlewares
	- `models/` para models
	- `utils/` para utilitários
- Todos os testes usam mocks, sem acesso ao banco real.
- Coverage configurado via Jest, ignorando arquivos da pasta `dist`.
- Para rodar os testes:
	```bash
	npm test
	npm run test:coverage
	```

## Estrutura de Pastas

```
UpWorkerApi/
	src/
		controllers/
		repositories/
		middlewares/
		models/
		utils/
		__tests__/
			controller/
			repository/
			middlewares/
			models/
			utils/
```


## Boas práticas
- Nunca acesse o banco real nos testes, sempre use mock.
- Separe os testes por pasta conforme o tipo.
- Use Jest + Supertest para testes de API.
- Coverage ignora arquivos da pasta `dist`.
- Use `AppBar` e toolbars fixos no topo para melhor UX no frontend.

## Exemplo de comando
```bash
npm test
```

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
3. Para rodar testes e coverage:
	```bash
	npm test
	npm run test:coverage
	```
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
