

# Orquestração com Docker Compose

As aplicações do projeto (exceto o frontend) são executadas via Docker Compose.


## Testes Automatizados e Coverage
- Todos os serviços backend possuem testes automatizados.
- Os testes não acessam o banco real, sempre usam mocks.
- Coverage configurado via Jest, ignorando arquivos da pasta `dist`.
- Para rodar os testes:
	```bash
	npm test
	npm run test:coverage
	```


## Serviços Orquestrados

- **api:** Backend Node.js/Express/TypeScript
	- Build automático da pasta UpWorkerApi
	- Imagem base: node:alpine (sempre a versão mais recente)
	- Porta exposta: 3001
	- Variáveis de ambiente: NODE_ENV, JWT_SECRET, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
	- Depende do serviço `db`
- **db:** PostgreSQL 16
	- Porta exposta: 5432
	- Usuário: postgres
	- Senha: postgres
	- Banco: upworker
	- Volume persistente: db_data
	- Criação automática de todas as tabelas essenciais (users, calleds, comments, attachments, logs, notifications) ao subir o container

## Redes e Volumes

- Rede interna: upworker-net (bridge)
- Volume: db_data para persistência do banco

## Frontend

- O frontend React/Vite roda fora do Compose em desenvolvimento para melhor experiência (HMR) e simplicidade.
- Proxy Vite redireciona `/api` para o backend em `localhost:3001`.

## Notas e Boas Práticas

- Variáveis sensíveis podem ser movidas para arquivos .env
- Publicar apenas as portas necessárias
- Logs e métricas podem ser adicionados como serviços adicionais futuramente
