
# Regras Gerais e Requisitos Não Funcionais

Este documento detalha as regras gerais e os requisitos não funcionais do sistema, conforme implementado.

## Requisitos Não Funcionais

- **RNF-001: Desempenho:** O sistema responde rapidamente, com telas carregando em até 3 segundos (frontend React/Vite, backend Express/TypeScript).
- **RNF-002: Segurança:** Acesso às etapas sensíveis (Aprovação, Agendamento, Execução) restrito por autenticação JWT e perfis (Analista/Executor).
- **RNF-003: Usabilidade:** Interface intuitiva, responsiva, com navegação protegida e feedback visual.
- **RNF-004: Compatibilidade:** Compatível com Chrome, Firefox, Edge.
- **RNF-005: Disponibilidade:** Backend e banco orquestrados via Docker Compose, facilitando alta disponibilidade.

## Premissas e Dependências

- **Premissa:** Usuários acessam via navegador compatível.
- **Dependência:** Infraestrutura de servidores e banco disponível.
- **Dependência:** Sistema de autenticação JWT implementado no backend.

## Métricas de Sucesso

- Redução de 30% no tempo médio de resolução de chamados em 6 meses.
- Aumento de 90% na satisfação dos usuários com o processo de solicitação de chamados, medido por pesquisa interna.
- Redução de 50% no número de chamados abertos por e-mail ou outros canais não oficiais.
