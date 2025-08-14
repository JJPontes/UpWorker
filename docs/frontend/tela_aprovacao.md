# Tela 2: Aprovação (Analista)

Nesta tela, o analista responsável avaliará a coerência e a viabilidade do chamado.


## Requisitos Funcionais

- **RF-005: Resumo da Solicitação:**
  - A tela exibirá um resumo com todas as informações preenchidas na etapa de Criação da Solicitação.
  - Chips de filtros ativos exibem os critérios aplicados (status, solicitante, datas), melhorando a clareza da filtragem.

- **RF-006: Ações de Aprovação:**
  - O analista terá três botões de ação disponíveis:
    - "Aprovar": Confirma o chamado e o move para a próxima etapa do workflow.
    - "Revisar": Devolve o chamado ao solicitante para ajustes.
    - "Reprovar": Cancela o chamado.
  - UX aprimorada: botões exibidos conforme perfil/status, feedback visual dinâmico.

- **RF-007: Justificativa para Revisão:**
  - Ao clicar em "Revisar", uma caixa de diálogo (dialog) será exibida.
  - Esta caixa de diálogo conterá um campo de texto (Textbox) para o analista descrever o motivo da revisão.
  - Um botão "Enviar" enviará a justificativa para o usuário solicitante e retornará o chamado ao status de "Em Revisão".

- **RF-008: Justificativa para Reprovação:**
  - Ao clicar em "Reprovar", uma caixa de diálogo (dialog) será exibida.
  - Esta caixa de diálogo conterá um campo de texto (Textbox) para o analista descrever o motivo da reprovação.
  - Um botão "Enviar" enviará a justificativa para o usuário solicitante e alterará o status do chamado para "Reprovado".
