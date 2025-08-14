it('POST /users - campos obrigatórios ausentes', async () => {
  const res = await request(app)
    .post('/users')
    .send({ nome: '', email: '', senha: '', perfil: '' });
  expect(res.status).toBe(400);
  expect(res.body.error).toBeDefined();
});

it('POST /users - e-mail já cadastrado', async () => {
  (usersRepository.findUserByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'user@email.com' });
  const res = await request(app)
    .post('/users')
    .send({ nome: 'Teste', email: 'user@email.com', senha: '123', perfil: 'user' });
  expect(res.status).toBe(409);
  expect(res.body.error).toBeDefined();
});

it('POST /users - erro interno', async () => {
  (usersRepository.createUser as jest.Mock).mockRejectedValue(new Error('Falha'));
  (usersRepository.findUserByEmail as jest.Mock).mockResolvedValue(undefined);
  const res = await request(app)
    .post('/users')
    .send({ nome: 'Teste', email: 'novo@email.com', senha: '123', perfil: 'user' });
  expect(res.status).toBe(500);
  expect(res.body.error).toBeDefined();
});
import request from 'supertest';
import express from 'express';
jest.mock('../../repositories/usersRepository');
import * as usersRepository from '../../repositories/usersRepository';
import usersRoutes from '../../routes/users';

const app = express();
app.use(express.json());
app.use('/users', usersRoutes);

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('GET /users - retorna lista mockada', async () => {
    (usersRepository.findAllUsers as jest.Mock).mockResolvedValue([
      { id: 1, nome: 'Usuário' }
    ]);
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: 1, nome: 'Usuário' }]);
    expect(usersRepository.findAllUsers).toHaveBeenCalled();
  });

  it('GET /users - erro do repository', async () => {
    (usersRepository.findAllUsers as jest.Mock).mockRejectedValue(new Error('Falha'));
    const res = await request(app).get('/users');
  expect(res.status).toBe(500);
  expect(res.body.error).toBeDefined();
  });
});
