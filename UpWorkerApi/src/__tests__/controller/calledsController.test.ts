it('GET /calleds/:id - chamado não encontrado', async () => {
  (calledsRepository.findCalledById as jest.Mock).mockResolvedValue(undefined);
  const res = await request(app).get('/calleds/999');
  expect(res.status).toBe(404);
  expect(res.body.error).toBeDefined();
});

it('GET /calleds/:id - erro interno', async () => {
  (calledsRepository.findCalledById as jest.Mock).mockRejectedValue(new Error('Falha'));
  const res = await request(app).get('/calleds/1');
  expect(res.status).toBe(500);
  expect(res.body.error).toBeDefined();
});
import request from 'supertest';
import express from 'express';
jest.mock('../../repositories/calledsRepository');
import * as calledsRepository from '../../repositories/calledsRepository';
import calledsRoutes from '../../routes/calleds';

const app = express();
app.use(express.json());
app.use('/calleds', calledsRoutes);

describe('Calleds API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('GET /calleds - retorna chamados filtrados', async () => {
    (calledsRepository.findAllCalleds as jest.Mock).mockResolvedValue([
      { id: 1, titulo: 'Teste', status: 'Criacao', criado_em: '2025-08-14' },
      { id: 2, titulo: 'Outro', status: 'Aprovacao', criado_em: '2025-08-15' },
    ]);
    const res = await request(app).get('/calleds?status=Criacao');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      { id: 1, titulo: 'Teste', status: 'Criacao', criado_em: '2025-08-14' },
      { id: 2, titulo: 'Outro', status: 'Aprovacao', criado_em: '2025-08-15' },
    ]);
    expect(calledsRepository.findAllCalleds).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'Criacao' })
    );
  });

  it('GET /calleds - retorna erro do repository', async () => {
  (calledsRepository.findAllCalleds as jest.Mock).mockRejectedValue(new Error('Falha'));
  const res = await request(app).get('/calleds');
  expect(res.status).toBe(500);
  expect(res.body.error).toBeDefined();
  });
});
