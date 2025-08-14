

# Arquitetura Frontend

Este documento descreve a arquitetura frontend implementada no projeto UpWorker.

## Tecnologias Utilizadas

- **Framework:** React 18
- **Build Tool:** Vite.js com TypeScript
- **UI Library:** MUI (Material UI v7)
- **HTTP Client:** Axios (configuração centralizada em `src/api.ts` com interceptor para JWT)
- **Roteamento:** React Router DOM v7
- **Gerenciador de Pacotes:** Yarn

## Integração com Backend

- **Proxy Vite:** Todas as chamadas HTTP para `/api` são redirecionadas para o backend Node/Express rodando em Docker (`localhost:3001`) via proxy configurado em `vite.config.ts`.
- **Paginação:** Listagem de chamados suporta paginação (parâmetros `page` e `pageSize`).
- **Autenticação JWT:** Token salvo no localStorage, enviado automaticamente pelo axios.


## Estrutura de Telas e Componentes

- **Login:** autenticação de usuário via JWT, integração real com backend.
- **Cadastro:** criação de usuário persistente no banco PostgreSQL via backend.
- **Listagem de Chamados:**
	- Exibe chamados paginados, ações conforme perfil e status.
	- Filtro aprimorado: permite filtrar por status, solicitante (input dinâmico) e intervalo de datas.
	- Filtro de datas implementado com componente dedicado `OrangeRangePicker` (Ant Design), com fundo laranja customizado nos dias selecionados.
	- Responsividade: filtro destacado para desktop, Drawer/hamburguer para mobile.
	- UX aprimorada: chips de filtros ativos, botões de ação dinâmicos conforme perfil/status.
- **Criação de Chamado:** formulário para abertura de chamado.
- **Header:** componente global reativo ao login/logout, exibe navegação condicional.


## UI/UX, Temas e Acessibilidade

- **Tema visual:** inspirado no upbrasil.com, com azul institucional, amarelo destaque e fundo claro.
- **Modo claro/escuro:** alternância dinâmica, respeitando preferências do sistema.
- **Font-family:** Montserrat, Arial, sans-serif (importada do Google Fonts).
- **Responsividade:** layout mobile-first usando Grid/Flex do MUI e breakpoints.
- **Acessibilidade:** botões com `aria-label`, navegação por teclado, contraste adequado.
- **Filtro de datas:** fundo laranja nos dias selecionados, via CSS customizado no componente `OrangeRangePicker`.
- **Drawer/hamburguer:** navegação e filtro otimizados para mobile.

## Observações

- Todas as chamadas HTTP utilizam o axios centralizado.
- O Header reflete automaticamente o estado de autenticação, inclusive entre abas.
- O frontend roda fora do Docker Compose para melhor experiência de desenvolvimento.
