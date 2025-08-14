import { User } from '../../models/User';

describe('User model', () => {
  it('cria objeto corretamente', () => {
    const user: User = {
      id: '1',
      nome: 'Teste',
      email: 'a@b.com',
      senha: '123',
      perfil: 'Analista',
    };
    expect(user.id).toBe('1');
    expect(user.nome).toBe('Teste');
    expect(user.email).toBe('a@b.com');
    expect(user.senha).toBe('123');
    expect(user.perfil).toBe('Analista');
  });
});
