jest.mock('../../db', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('usersRepository', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('findAllUsers retorna dados mockados', async () => {
    const mockRows = [{ id: 1, nome: 'Usuário' }];
    require('../../db').default.query.mockResolvedValue({ rows: mockRows });
    const { findAllUsers } = await import('../../repositories/usersRepository');
    const result = await findAllUsers();
    expect(result).toEqual(mockRows);
  });

  it('findAllUsers lida com erro', async () => {
    require('../../db').default.query.mockRejectedValue(new Error('Falha'));
    const { findAllUsers } = await import('../../repositories/usersRepository');
    await expect(findAllUsers()).rejects.toThrow('Falha');
  });
});
