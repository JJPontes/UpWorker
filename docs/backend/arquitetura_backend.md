

# Arquitetura Backend

Este documento descreve a arquitetura backend implementada no projeto UpWorker.


## Testes Automatizados e Coverage
- Todos os testes do backend estão em `src/__tests__`, separados por tipo (controller, repository, middleware, model, utils).
- Sempre use mocks para dependências externas e banco de dados.
- Coverage configurado via Jest, ignorando arquivos da pasta `dist`.
- Para rodar os testes:
	```bash
	npm test
	npm run test:coverage
	```

- Exemplo de mock de pool do PostgreSQL:
	```js
	jest.mock('../db', () => ({ default: { query: jest.fn() } }));
	```

## Tecnologias Utilizadas

- **Linguagem/Framework:** Node.js com Express (TypeScript)
- **Banco de Dados:** PostgreSQL (persistência real via Docker Compose)
- **Autenticação:** JWT (JSON Web Tokens)
- **Gerenciador de Pacotes:** Yarn
- **Imagem Docker:** Node.js última versão Alpine
- **Documentação de API:** Swagger disponível em `/api-docs` (autogerada a partir das rotas)



## Estrutura e Organização

- **Separação de responsabilidades:**
	- Controllers: regras de negócio e validação das requisições
	- Repositories: integração direta com o banco de dados
	- Routers: apenas delegam para controllers, sem lógica

- **Rotas documentadas via Swagger:**
	- Todas as rotas principais possuem comentários Swagger diretamente nos arquivos de router, permitindo documentação automática em `/api-docs`.
	- Exemplos:
		- `POST /users`: Criação de usuário
		- `GET /users`: Listagem de usuários
		- `POST /auth/login`: Autenticação e geração de token JWT
		- `POST /bugAnalyze`: Avaliação de descrição de bug
		- `GET/POST/PUT/DELETE /calleds`: CRUD completo de chamados

- **Modelos:**
	- `User`: representa usuários, com perfis "Analista" e "Executor"
	- `Called`: representa chamados, com status e workflow definidos
	- `Comment`: comentários vinculados a chamados
	- `Attachment`: anexos vinculados a chamados
	- `Log`: log de ações nos chamados
	- `Notification`: notificações para usuários

- **Perfis de usuário:**
	- Acesso e ações restritos conforme perfil (Analista/Executor)

- **TypeScript:**
	- Todo o backend implementado em TypeScript, com tipagem forte e modularização

- **Integração real com PostgreSQL:**
	- Todas as operações CRUD persistem dados no banco
	- Listagem de chamados suporta paginação
	- Tabelas auxiliares para comentários, anexos, logs e notificações criadas automaticamente

## Exemplos de Uso das Rotas

```http
POST /users
{
	"nome": "João",
	"email": "joao@exemplo.com",
	"senha": "123456",
	"perfil": "Analista"
}

POST /auth/login
{
	"email": "joao@exemplo.com",
	"senha": "123456"
}

POST /bugAnalyze
{
	"description": "Ao clicar em salvar, o sistema retorna erro 500."
}
```

## Segurança

- **JWT:** autenticação e autorização em todas as rotas protegidas
- **Validação de perfil:** middleware e lógica de negócio para garantir acesso correto


## Observações

- Estrutura modular facilita manutenção e testes
- Swagger disponível em `/api-docs`
- O frontend acessa o backend via proxy Vite (`/api` → `localhost:3001`)
- O banco de dados é inicializado automaticamente com todas as tabelas essenciais ao subir o container Docker
