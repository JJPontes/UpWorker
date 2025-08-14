it('POST /auth/login - cadastro incompleto', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: '' }); // senha ausente
  expect(res.status).toBe(400);
  expect(res.body.error).toBeDefined();
});

it('POST /auth/login - credenciais inválidas', async () => {
  const bcrypt = require('bcryptjs');
  const senhaHash = await bcrypt.hash('123', 10);
  (usersRepository.findUserByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'user@email.com', senha: senhaHash, nome: 'Usuário', perfil: 'user' });
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'user@email.com', senha: 'wrong' });
  expect(res.status).toBe(401);
  expect(res.body.error).toBeDefined();
});

it('POST /auth/login - erro interno', async () => {
  (usersRepository.findUserByEmail as jest.Mock).mockRejectedValue(new Error('Falha'));
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'user@email.com', senha: '123' });
  expect(res.status).toBe(500);
  expect(res.body.error).toBeDefined();
});
import request from 'supertest';
import express from 'express';
jest.mock('../../repositories/usersRepository');
import * as usersRepository from '../../repositories/usersRepository';
import authRoutes from '../../routes/auth';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('POST /auth/login - sucesso', async () => {
  const bcrypt = require('bcryptjs');
  const senhaHash = await bcrypt.hash('123', 10);
  (usersRepository.findUserByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'user@email.com', senha: senhaHash, nome: 'Usuário', perfil: 'user' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@email.com', senha: '123' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(usersRepository.findUserByEmail).toHaveBeenCalledWith('user@email.com');
  });

  it('POST /auth/login - erro do repository', async () => {
    (usersRepository.findUserByEmail as jest.Mock).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@email.com', senha: '123' });
  expect(res.status).toBe(401);
  expect(res.body.error).toBeDefined();
  });
});
