# UpWorker Web

Frontend React 18 + Vite + MUI para o sistema UpWorker.

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

- Proxy Vite redireciona `/api` para backend (`localhost:3010`)
- Fallback automático para múltiplas portas (3005/3010)

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
