import pool from '../db';
// ...existing code...

export async function findAllCalleds(params: { status?: string, solicitante?: string, page?: number, pageSize?: number }) {
  let query = `SELECT c.*, u.nome as nameUser, u.id as userId FROM calleds c JOIN users u ON c.solicitante = u.id`;
  const queryParams: any[] = [];
  const where: string[] = [];
  if (params.status) {
    queryParams.push(params.status);
    where.push(`status = $${queryParams.length}`);
  }
  if (params.solicitante) {
    queryParams.push(params.solicitante);
    where.push(`solicitante = $${queryParams.length}`);
  }
  if (where.length) {
    query += ' WHERE ' + where.join(' AND ');
  }
  query += ' ORDER BY id';
  const pageNum = Math.max(1, params.page || 1);
  const pageSizeNum = Math.max(1, params.pageSize || 10);
  const offset = (pageNum - 1) * pageSizeNum;
  query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(pageSizeNum, offset);
  const result = await pool.query(query, queryParams);
  return result.rows;
}

export async function findCalledById(id: string) {
  const result = await pool.query(`SELECT c.*, u.nome as nameUser, u.id as userId FROM calleds c JOIN users u ON c.solicitante = u.id WHERE c.id = $1::uuid`, [id]);
  return result.rows[0];
}

// ...outros métodos: create, update, delete
