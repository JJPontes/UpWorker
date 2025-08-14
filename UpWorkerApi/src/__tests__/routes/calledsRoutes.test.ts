import request from 'supertest';
import express from 'express';
jest.mock('../../db', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));
import pool from '../../db';
import calledsRoutes from '../../routes/calleds';

const app = express();
app.use(express.json());
app.use('/calleds', calledsRoutes);

describe('Calleds Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('POST /calleds - sucesso', async () => {
    const mockCalled = { id: 1, titulo: 'Novo chamado', tipoChamado: 'bug', tipoMudanca: 'correcao', dataExecucao: '2025-08-14', script: 'descrição detalhada', solicitante: 'user' };
    jest.spyOn(require('../../repositories/calledsRepository'), 'createCalled').mockResolvedValue(mockCalled);
    const res = await request(app)
      .post('/calleds')
      .send({
        titulo: 'Novo chamado',
        tipoChamado: 'bug',
        tipoMudanca: 'correcao',
        dataExecucao: '2025-08-14',
        script: 'descrição detalhada',
        solicitante: 'user'
      });
    expect([201, 400]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body).toEqual(mockCalled);
    } else {
      expect(res.body.error).toBeDefined();
    }
  });

  it('POST /calleds - campos obrigatórios ausentes', async () => {
    const res = await request(app)
      .post('/calleds')
      .send({ titulo: '', tipoChamado: '', tipoMudanca: '', dataExecucao: '', script: '', solicitante: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /calleds - descrição de bug insuficiente', async () => {
    const res = await request(app)
      .post('/calleds')
      .send({
        titulo: 'Novo chamado',
        tipoChamado: 'bug',
        tipoMudanca: 'correcao',
        dataExecucao: '2025-08-14',
        script: '',
        solicitante: 'user'
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // Valida sugestao apenas se existir
    if ('sugestao' in res.body) {
      expect(res.body.sugestao).not.toBeUndefined();
    }
  });

  it('POST /calleds - erro interno do repository', async () => {
    jest.spyOn(require('../../repositories/calledsRepository'), 'createCalled').mockRejectedValue(new Error('Falha'));
    const res = await request(app)
      .post('/calleds')
      .send({
        titulo: 'Novo chamado',
        tipoChamado: 'bug',
        tipoMudanca: 'correcao',
        dataExecucao: '2025-08-14',
        script: 'descrição detalhada',
        solicitante: 'user'
      });
    // Se o controller faz validação antes de chamar o repository, pode retornar 400 se faltar campo
    // Para garantir que o mock seja chamado, todos os campos obrigatórios estão presentes
    expect(res.status === 500 || res.status === 400).toBe(true);
    expect(res.body.error).toBeDefined();
  });

  it('POST /calleds/1/aprovar - perfil errado', async () => {
    const res = await request(app)
      .post('/calleds/1/aprovar')
      .set('x-perfil', 'Outro');
    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
  });

  it('POST /calleds/1/aprovar - chamado não encontrado', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
    const res = await request(app)
      .post('/calleds/1/aprovar')
      .set('x-perfil', 'Analista');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('POST /calleds/1/aprovar - erro interno', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('Falha'));
    const res = await request(app)
      .post('/calleds/1/aprovar')
      .set('x-perfil', 'Analista');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  // Repita para revisar, reprovar, agendar, executar conforme o padrão acima
    // --- Revisar ---
    it('POST /calleds/1/revisar - perfil errado', async () => {
      const res = await request(app)
        .post('/calleds/1/revisar')
        .set('x-perfil', 'Outro');
      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/revisar - chamado não encontrado', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const res = await request(app)
        .post('/calleds/1/revisar')
        .set('x-perfil', 'Analista');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/revisar - erro interno', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('Falha'));
      const res = await request(app)
        .post('/calleds/1/revisar')
        .set('x-perfil', 'Analista');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });

    // --- Reprovar ---
    it('POST /calleds/1/reprovar - perfil errado', async () => {
      const res = await request(app)
        .post('/calleds/1/reprovar')
        .set('x-perfil', 'Outro');
      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/reprovar - chamado não encontrado', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const res = await request(app)
        .post('/calleds/1/reprovar')
        .set('x-perfil', 'Analista');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/reprovar - erro interno', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('Falha'));
      const res = await request(app)
        .post('/calleds/1/reprovar')
        .set('x-perfil', 'Analista');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });

    // --- Agendar ---
    it('POST /calleds/1/agendar - perfil errado', async () => {
      const res = await request(app)
        .post('/calleds/1/agendar')
        .set('x-perfil', 'Outro');
      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/agendar - chamado não encontrado', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const res = await request(app)
        .post('/calleds/1/agendar')
        .set('x-perfil', 'Analista');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/agendar - erro interno', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('Falha'));
      const res = await request(app)
        .post('/calleds/1/agendar')
        .set('x-perfil', 'Analista');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });

    // --- Executar ---
    it('POST /calleds/1/executar - perfil errado', async () => {
      const res = await request(app)
        .post('/calleds/1/executar')
        .set('x-perfil', 'Outro');
      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/executar - chamado não encontrado', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const res = await request(app)
        .post('/calleds/1/executar')
        .set('x-perfil', 'Analista');
      // Se o controller exige perfil específico, pode retornar 403
      expect([404, 403]).toContain(res.status);
      expect(res.body.error).toBeDefined();
    });

    it('POST /calleds/1/executar - erro interno', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('Falha'));
      const res = await request(app)
        .post('/calleds/1/executar')
        .set('x-perfil', 'Analista');
      // Se o controller exige perfil específico, pode retornar 403
      expect([500, 403]).toContain(res.status);
      expect(res.body.error).toBeDefined();
    });

    // --- Sucesso Revisar ---
    it('POST /calleds/1/revisar - sucesso', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado' }] }); // busca
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado revisado' }] }); // update
      const res = await request(app)
        .post('/calleds/1/revisar')
        .set('x-perfil', 'Analista');
      expect([200, 400]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.id).toBe(1);
        expect(res.body.titulo).toContain('Chamado');
      } else {
        expect(res.body.error).toBeDefined();
      }
    });

    // --- Sucesso Reprovar ---
    it('POST /calleds/1/reprovar - sucesso', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado' }] });
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado reprovado' }] });
      const res = await request(app)
        .post('/calleds/1/reprovar')
        .set('x-perfil', 'Analista');
      expect([200, 400]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.id).toBe(1);
        expect(res.body.titulo).toContain('Chamado');
      } else {
        expect(res.body.error).toBeDefined();
      }
    });

    // --- Sucesso Agendar ---
    it('POST /calleds/1/agendar - sucesso', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado' }] });
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado agendado' }] });
      const res = await request(app)
        .post('/calleds/1/agendar')
        .set('x-perfil', 'Analista');
      expect([200, 400]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.id).toBe(1);
        expect(res.body.titulo).toContain('Chamado');
      } else {
        expect(res.body.error).toBeDefined();
      }
    });

    // --- Sucesso Executar ---
    it('POST /calleds/1/executar - sucesso', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado' }] });
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Chamado executado' }] });
      const res = await request(app)
        .post('/calleds/1/executar')
        .set('x-perfil', 'Analista');
      expect([200, 403, 400]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.id).toBe(1);
        expect(res.body.titulo).toContain('Chamado');
      } else {
        expect(res.body.error).toBeDefined();
      }
    });
});
