// ...existing code...
// ...existing code...
import nlp from 'compromise';
/**
 * @swagger
 * /calleds:
 *   get:
 *     summary: Listar chamados
 *     description: Retorna todos os chamados cadastrados.
 *     responses:
 *       200:
 *         description: Lista de chamados
 */
function avaliarDescricaoBug(descricao: string): { ok: boolean, sugestao?: string } {
  if (!descricao) return { ok: false, sugestao: "Descreva o sistema, o ocorrido e o que espera." };
  const doc = nlp(descricao);
  // Palavras/frases para cada critério
  const sistemas = ["sistema", "app", "aplicativo", "site", "plataforma", "módulo", "painel"];
  const ocorridos = ["erro", "falha", "problema", "bug", "travou", "não funciona", "parou", "exceção", "crash", "quebrou", "inconsistência"];
  const desejos = ["gostaria", "preciso", "solicito", "quero", "necessito", "favor", "arrumar", "resolver", "corrigir", "ajuda"];
  const hasVerb = doc.verbs().out('array').length > 0;
  const hasSystem = sistemas.some(p => doc.has(p));
  const hasProblem = ocorridos.some(p => doc.has(p));
  const hasWish = desejos.some(p => doc.has(p));
  if (hasVerb && hasSystem && hasProblem && hasWish) return { ok: true };
  let sugestao = "Sugestão: cite o sistema afetado, descreva o ocorrido e o que espera.\nExemplo: 'No sistema X, ocorreu um erro ao salvar. Gostaria que fosse corrigido.'";
  return { ok: false, sugestao };
}
import { Router, Request, Response } from 'express';
import multer from 'multer';

import pool from '../db';
import { listarChamados, buscarChamadoPorId } from '../controllers/calledsController';

const router = Router();
// ...existing code...
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
/**
 * @swagger
 * /calleds/{id}:
 *   get:
 *     summary: Buscar chamado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado encontrado
 *       404:
 *         description: Chamado não encontrado
 */
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/sql', 'text/plain'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de arquivo não permitido'));
  }
});

/**
 * @swagger
 * /calleds:
 *   get:
 *     summary: Listar chamados
 *     description: Lista todos os chamados, com filtros opcionais por status e solicitante.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status do chamado
 *       - in: query
 *         name: solicitante
 *         schema:
 *           type: string
 *         description: Filtrar por solicitante
 *     responses:
 *       200:
 *         description: Lista de chamados
 */
router.get('/', listarChamados);

/**
 * @swagger
 * /calleds/{id}:
 *   get:
 *     summary: Buscar chamado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado encontrado
 *       404:
 *         description: Chamado não encontrado
 */
router.get('/:id', buscarChamadoPorId);

/**
 * @swagger
 * /calleds:
 *   post:
 *     summary: Criar chamado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               solicitante:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chamado criado
 *       400:
 *         description: Campos obrigatórios ausentes
 */
router.post('/', upload.single('anexo'), async (req: Request, res: Response) => {
  // Extrai campos do body (FormData)
  const {
    titulo,
    tipoChamado,
    tipoMudanca,
    dataExecucao,
    script,
    emergencial,
    solicitante // agora é o nome do usuário
  } = req.body;
  // Validação dos campos obrigatórios
  if (!titulo || !tipoChamado || !tipoMudanca || !dataExecucao || !script || !solicitante) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.', request: req.body });
  }
  // Se for chamado de bug, avalia a descrição
  if (tipoChamado && tipoChamado.toLowerCase() === 'bug') {
    const avaliacao = avaliarDescricaoBug(script);
    if (!avaliacao.ok) {
      return res.status(400).json({ erro: 'Descrição insuficiente para chamado de bug.', sugestao: avaliacao.sugestao });
    }
  }
  // Busca o id do usuário pelo nome
  let solicitanteId: string | null = null;
  try {
    const userResult = await pool.query('SELECT id FROM users WHERE nome = $1', [solicitante]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ erro: 'Usuário solicitante não encontrado.' });
    }
    solicitanteId = userResult.rows[0].id;
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ erro: 'Erro ao buscar usuário solicitante.' });
  }
  // Processa anexo
  let anexoBuffer: Buffer | null = null;
  let anexoNome: string | null = null;
  let anexoTipo: string | null = null;
  const file = (req as any).file as Express.Multer.File | undefined;
  if (file) {
    anexoBuffer = file.buffer;
    anexoNome = file.originalname;
    anexoTipo = file.mimetype;
  }
  try {
    const uuid = require('crypto').randomUUID();
    const result = await pool.query(
      `INSERT INTO calleds (
        uuid, titulo, tipo_chamado, tipo_mudanca, data_execucao, script, emergencial, anexo, anexo_nome, anexo_tipo, status, solicitante
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Criacao', $11
      ) RETURNING *`,
      [
        uuid,
        titulo,
        tipoChamado,
        tipoMudanca,
        dataExecucao,
        script,
        emergencial ?? false,
        anexoBuffer,
        anexoNome,
        anexoTipo,
        solicitanteId
      ]
    );
    res.status(201).json({ ...result.rows[0], uuid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar chamado.' });
  }
});

/**
 * @swagger
 * /calleds/{id}/aprovar:
 *   post:
 *     summary: Aprovar chamado
 *     description: Apenas Analista pode aprovar.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chamado aprovado
 *       403:
 *         description: Apenas Analista pode aprovar
 *       404:
 *         description: Chamado não encontrado
 */
router.post('/:id/aprovar', async (req: Request, res: Response) => {
  const perfil = req.headers['x-perfil'] || '';
  if (perfil !== 'Analista') {
    return res.status(403).json({ erro: 'Apenas Analista pode aprovar.' });
  }
  try {
    // Busca chamado
    const result = await pool.query('SELECT * FROM calleds WHERE id = $1', [req.params.id]);
    const called = result.rows[0];
    if (!called) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    if (called.status !== 'Aprovacao' && called.status !== 'Criacao') {
      return res.status(400).json({ erro: 'Chamado não está em etapa de aprovação.' });
    }
    // Atualiza status
  const upd = await pool.query('UPDATE calleds SET status = $1 WHERE id = $2::uuid RETURNING *', ['Agendamento', req.params.id]);
    console.log(`Notificação: chamado ${called.id} agendado para o solicitante ${called.solicitante}`);
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao aprovar chamado.' });
  }
});

/**
 * @swagger
 * /calleds/{id}/revisar:
 *   post:
 *     summary: Devolver chamado para revisão
 *     description: Apenas Analista pode devolver para revisão.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado devolvido para revisão
 *       403:
 *         description: Apenas Analista pode devolver para revisão
 *       404:
 *         description: Chamado não encontrado
 */
router.post('/:id/revisar', async (req: Request, res: Response) => {
  const perfil = req.headers['x-perfil'] || '';
  if (perfil !== 'Analista') {
    return res.status(403).json({ erro: 'Apenas Analista pode devolver para revisão.' });
  }
  try {
  const result = await pool.query('SELECT * FROM calleds WHERE id = $1::uuid', [req.params.id]);
    const called = result.rows[0];
    if (!called) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    if (called.status !== 'Aprovacao') {
      return res.status(400).json({ erro: 'Chamado não está em etapa de aprovação.' });
    }
  const upd = await pool.query('UPDATE calleds SET status = $1 WHERE id = $2::uuid RETURNING *', ['Em Revisao', req.params.id]);
    console.log(`Notificação: chamado ${called.id} devolvido para revisão ao solicitante ${called.solicitante}`);
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao devolver chamado para revisão.' });
  }
});

/**
 * @swagger
 * /calleds/{id}/reprovar:
 *   post:
 *     summary: Reprovar chamado
 *     description: Apenas Analista pode reprovar.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado reprovado
 *       403:
 *         description: Apenas Analista pode reprovar
 *       404:
 *         description: Chamado não encontrado
 */
router.post('/:id/reprovar', async (req: Request, res: Response) => {
  const perfil = req.headers['x-perfil'] || '';
  if (perfil !== 'Analista') {
    return res.status(403).json({ erro: 'Apenas Analista pode reprovar.' });
  }
  try {
  const result = await pool.query('SELECT * FROM calleds WHERE id = $1::uuid', [req.params.id]);
    const called = result.rows[0];
    if (!called) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    if (called.status !== 'Aprovacao') {
      return res.status(400).json({ erro: 'Chamado não está em etapa de aprovação.' });
    }
  const upd = await pool.query('UPDATE calleds SET status = $1 WHERE id = $2::uuid RETURNING *', ['Reprovado', req.params.id]);
    console.log(`Notificação: chamado ${called.id} reprovado para o solicitante ${called.solicitante}`);
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao reprovar chamado.' });
  }
});

/**
 * @swagger
 * /calleds/{id}/agendar:
 *   post:
 *     summary: Agendar chamado
 *     description: Apenas Analista pode agendar.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado agendado
 *       403:
 *         description: Apenas Analista pode agendar
 *       404:
 *         description: Chamado não encontrado
 */
router.post('/:id/agendar', async (req: Request, res: Response) => {
  const perfil = req.headers['x-perfil'] || '';
  if (perfil !== 'Analista') {
    return res.status(403).json({ erro: 'Apenas Analista pode agendar.' });
  }
  try {
  const result = await pool.query('SELECT * FROM calleds WHERE id = $1::uuid', [req.params.id]);
    const called = result.rows[0];
    if (!called) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    if (called.status !== 'Aprovacao') {
      return res.status(400).json({ erro: 'Chamado não está em etapa de aprovação.' });
    }
  const upd = await pool.query('UPDATE calleds SET status = $1 WHERE id = $2::uuid RETURNING *', ['Agendamento', req.params.id]);
    console.log(`Notificação: chamado ${called.id} agendado para o solicitante ${called.solicitante}`);
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao agendar chamado.' });
  }
});

/**
 * @swagger
 * /calleds/{id}/executar:
 *   post:
 *     summary: Executar chamado
 *     description: Apenas Executor pode executar.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado executado
 *       403:
 *         description: Apenas Executor pode executar
 *       404:
 *         description: Chamado não encontrado
 */
router.post('/:id/executar', async (req: Request, res: Response) => {
  const perfil = req.headers['x-perfil'] || '';
  if (perfil !== 'Executor') {
    return res.status(403).json({ erro: 'Apenas Executor pode executar.' });
  }
  try {
  const result = await pool.query('SELECT * FROM calleds WHERE id = $1::uuid', [req.params.id]);
    const called = result.rows[0];
    if (!called) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    if (called.status !== 'Agendamento') {
      return res.status(400).json({ erro: 'Chamado não está em etapa de agendamento.' });
    }
  const upd = await pool.query('UPDATE calleds SET status = $1 WHERE id = $2::uuid RETURNING *', ['Execucao', req.params.id]);
    console.log(`Notificação: chamado ${called.id} executado para o solicitante ${called.solicitante}`);
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao executar chamado.' });
  }
});

export default router;
