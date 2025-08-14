import pool from '../db';

export async function findAllUsers() {
  const result = await pool.query('SELECT id, nome, email, perfil FROM users ORDER BY nome');
  return result.rows;
}

export async function findUserByEmail(email: string) {
  const result = await pool.query('SELECT id, nome, email, perfil FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function createUser({ id, nome, email, senhaHash, perfil }: { id: string, nome: string, email: string, senhaHash: string, perfil: string }) {
  const result = await pool.query(
    'INSERT INTO users (id, nome, email, senha, perfil) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, perfil',
    [id, nome, email, senhaHash, perfil]
  );
  return result.rows[0];
}
