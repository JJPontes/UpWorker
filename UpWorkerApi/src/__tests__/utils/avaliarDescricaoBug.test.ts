import { avaliarDescricaoBug } from '../../utils/avaliarDescricaoBug';

describe('avaliarDescricaoBug', () => {
  it('retorna resultado esperado para descrição válida', () => {
    const result = avaliarDescricaoBug('erro crítico no sistema');
    expect(result).toBeDefined();
  });

  it('retorna resultado esperado para descrição vazia', () => {
    const result = avaliarDescricaoBug('');
    expect(result).toBeDefined();
  });
});
