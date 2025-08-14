
describe('calledsRepository', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('findAllCalleds retorna dados mockados', async () => {
    jest.resetModules();
    jest.mock('../../db', () => ({
      __esModule: true,
      default: { query: jest.fn().mockResolvedValue({ rows: [{ id: 1, titulo: 'Teste', nameUser: 'User' }] }) }
    }));
    const { findAllCalleds } = await import('../../repositories/calledsRepository');
    const result = await findAllCalleds({});
    expect(result[0].id).toBe(1);
    expect(result[0].titulo).toBe('Teste');
  });

  it('findAllCalleds lida com erro', async () => {
    jest.resetModules();
    jest.mock('../../db', () => ({
      __esModule: true,
      default: { query: jest.fn().mockRejectedValue(new Error('Falha')) }
    }));
    const { findAllCalleds } = await import('../../repositories/calledsRepository');
    await expect(findAllCalleds({})).rejects.toThrow('Falha');
  });
});
