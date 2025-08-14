
# Regras de Negócio

Este documento descreve as regras de negócio do sistema de chamados, conforme implementado.

## Workflow dos Chamados

- O fluxo de um chamado segue as etapas:
  1. Criação
  2. Aprovação
  3. Agendamento
  4. Execução
- Um chamado pode ser devolvido para "Em Revisão" a partir da etapa de "Aprovação".
- Um chamado pode ser "Reprovado" na etapa de "Aprovação", encerrando o fluxo.
- Apenas usuários com perfil **Analista** podem aprovar, revisar, reprovar e agendar chamados.
- Apenas usuários com perfil **Executor** podem confirmar a execução de um chamado.

## Perfis e Restrições

- **Analista:** pode aprovar, revisar, reprovar e agendar chamados.
- **Executor:** pode executar chamados agendados.
- As ações disponíveis em cada tela são controladas conforme o perfil do usuário autenticado.

## Notificações (implementação futura)

- O sistema está preparado para notificar o solicitante nas seguintes situações:
  - Devolução para revisão
  - Reprovação
  - Aprovação
  - Agendamento
  - Execução

## Observações

- O backend valida o perfil do usuário em cada ação sensível.
- O frontend exibe apenas as ações permitidas conforme o perfil e status do chamado.
