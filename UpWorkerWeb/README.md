# UpWorker Web

Frontend React 18 + Vite + MUI para o sistema UpWorker.
## Testes Automatizados

- Recomenda-se usar Jest + React Testing Library para componentes.
- Separe os testes por pasta conforme o tipo de componente ou página.
- Use mocks para chamadas à API nos testes de frontend.
- Mantenha os testes automatizados sempre atualizados conforme as melhorias do backend.
- Para rodar os testes:
 - Sempre utilize mocks para chamadas HTTP e dados externos, evitando dependências reais.
 - Recomenda-se configurar coverage (cobertura) com Jest para garantir qualidade.
 - Exemplo de mock de chamada à API:
	 ```js
	 jest.mock('axios');
	 import axios from 'axios';
	 axios.get.mockResolvedValue({ data: { ... } });
	 ```
 - Para rodar os testes:
	 ```bash
	 npm test
	 ```

## Estrutura de Pastas de Testes
```
UpWorkerWeb/
	src/
		components/
		pages/
		api/
		__tests__/
```

## Principais Recursos

- Telas de login, cadastro, listagem e criação de chamados
- Integração real com backend via Axios
- Autenticação JWT
- Tema visual inspirado no upbrasil.com
- Alternância de modo claro/escuro
- Font-family Montserrat
- Responsividade e acessibilidade
- Filtros dinâmicos, chips de filtros ativos, Drawer/hamburguer para mobile

## Como rodar

1. Instale dependências: `yarn install` ou `npm install`
2. Rode: `yarn dev` ou `npm run dev`
3. Acesse: [http://localhost:5173](http://localhost:5173)

## Integração com Backend

- Proxy Vite redireciona `/api` para backend (`http://localhost:3010`)
- Fallback automático para múltiplas portas (3005/3010) já inclui o prefixo `/api`

## Estrutura

- `src/` - código fonte
- `components/` - componentes globais
- `pages/` - telas principais
- `api.ts` - configuração centralizada do Axios

## Exemplos de Uso

```js
// Login
axios.post('/api/auth/login', { email, senha })

// Listagem de chamados
axios.get('/api/calleds?page=1&pageSize=10')

// Criação de chamado
axios.post('/api/calleds', { titulo, descricao, ... })
```

## Observações

- O frontend roda fora do Docker Compose para melhor experiência de desenvolvimento
- O Header reflete automaticamente o estado de autenticação
