export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string; // hash em produção
  perfil: 'Analista' | 'Executor';
}
