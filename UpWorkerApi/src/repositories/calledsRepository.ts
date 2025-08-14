import pool from "../db";
// ...existing code...

export async function findAllCalleds(params: {
  status?: string;
  solicitante?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  pageSize?: number;
}) {
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
  if (params.dataInicio && params.dataFim) {
    queryParams.push(params.dataInicio);
    where.push(`criado_em >= $${queryParams.length}`);
    queryParams.push(params.dataFim);
    where.push(`criado_em <= $${queryParams.length}`);
  }
  if (where.length) {
    query += " WHERE " + where.join(" AND ");
  }
  query += " ORDER BY id";
  const pageNum = Math.max(1, params.page || 1);
  const pageSizeNum = Math.max(1, params.pageSize || 10);
  const offset = (pageNum - 1) * pageSizeNum;
  query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(pageSizeNum, offset);
  const result = await pool.query(query, queryParams);
  return result.rows.map((row) => ({
    ...row,
    solicitante: {
      id: row.userid,
      name: row.nameuser,
    },
  }));
}

export async function findCalledById(id: number) {
  const result = await pool.query(
    `SELECT c.*, u.nome as nameUser, u.id as userId FROM calleds c JOIN users u ON c.solicitante = u.id WHERE c.id = $1::int`,
    [id],
  );
  return result.rows[0];
}

export async function createCalled({
  titulo,
  tipoChamado,
  tipoMudanca,
  dataExecucao,
  script,
  solicitante,
  ambiente,
  executor,
  aprovador,
  emergencial,
  anexo,
  anexo_nome,
  anexo_tipo,
}: {
  titulo: string;
  tipoChamado: string;
  tipoMudanca: string;
  dataExecucao: string;
  script: string;
  solicitante: string;
  ambiente?: string | null;
  executor?: string | null;
  aprovador?: string | null;
  emergencial?: boolean;
  anexo?: Buffer | null;
  anexo_nome?: string | null;
  anexo_tipo?: string | null;
}) {
  // Busca id do usuário pelo nome
  const userResult = await pool.query("SELECT id FROM users WHERE nome = $1", [
    solicitante,
  ]);
  if (userResult.rows.length === 0) {
    throw new Error("Usuário solicitante não encontrado.");
  }
  const solicitanteId = userResult.rows[0].id;
  const insertQuery = `
    INSERT INTO calleds (
      titulo, tipo_chamado, tipo_mudanca, data_execucao, script, solicitante, ambiente, executor, aprovador, emergencial, anexo, anexo_nome, anexo_tipo
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    ) RETURNING id, uuid, titulo, tipo_chamado, tipo_mudanca, data_execucao, script, solicitante, ambiente, executor, aprovador, emergencial, criado_em, anexo_nome, anexo_tipo
  `;
  const values = [
    titulo,
    tipoChamado,
    tipoMudanca,
    dataExecucao,
    script,
    solicitanteId,
    ambiente,
    executor,
    aprovador,
    emergencial,
    anexo,
    anexo_nome,
    anexo_tipo,
  ];
  const result = await pool.query(insertQuery, values);
  return result.rows[0];
}
