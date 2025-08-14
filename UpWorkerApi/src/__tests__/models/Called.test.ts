import { Called } from '../../models/Called';

describe('Called model', () => {
  it('cria objeto corretamente', () => {
    const called: Called = {
      id: 1,
      uuid: 'uuid-123',
      tipoChamado: 'Bug',
      tipoMudanca: 'Corretiva',
      ambiente: 'Produção',
      executor: 'Executor',
      aprovador: 'Analista',
      dataExecucao: '2025-08-14',
      script: 'SELECT 1;',
      emergencial: false,
      status: 'Criacao',
      solicitante: 'Usuário',
      criadoEm: new Date('2025-08-14'),
    };
    expect(called.id).toBe(1);
    expect(called.status).toBe('Criacao');
    expect(called.tipoChamado).toBe('Bug');
    expect(called.ambiente).toBe('Produção');
    expect(called.solicitante).toBe('Usuário');
  });
});
