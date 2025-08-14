export type StatusCalled = 'Criacao' | 'Aprovacao' | 'Agendamento' | 'Execucao' | 'Em Revisao' | 'Reprovado';

export interface Called {
  id: string;
  uuid: string;
  tipoChamado: 'Bug' | 'Melhoria' | 'Projeto';
  tipoMudanca: 'Corretiva' | 'Evolutiva' | 'Banco de Dados' | 'Infraestrutura';
  ambiente: 'Produção' | 'Homologação' | 'Desenvolvimento';
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
