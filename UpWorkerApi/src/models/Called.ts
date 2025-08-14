export type StatusCalled =
  | "Criacao"
  | "Aprovacao"
  | "Agendamento"
  | "Execucao"
  | "Em Revisao"
  | "Reprovado";

export interface Called {
  id: number; // int PK gerado pelo banco
  uuid: string; // UUID gerado pelo banco
  tipoChamado: "Bug" | "Melhoria" | "Projeto";
  tipoMudanca: "Corretiva" | "Evolutiva" | "Banco de Dados" | "Infraestrutura";
  ambiente: "Produção" | "Homologação" | "Desenvolvimento";
  executor: string;
  aprovador: string;
  dataExecucao: string;
  script: string;
  emergencial: boolean;
  anexo?: string;
  status: StatusCalled;
  solicitante: string;
  criadoEm: Date;
}
