// ...existing code...
// ...existing code...
/**
 * @swagger
 * /api/calleds:
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
import { avaliarDescricaoBug } from "../utils/avaliarDescricaoBug";
import { Router, Request, Response } from "express";
import multer from "multer";

import pool from "../db";
import {
  listarChamados,
  buscarChamadoPorId,
} from "../controllers/calledsController";
import { createCalled } from "../repositories/calledsRepository";

const router = Router();
// ...existing code...
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/sql",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de arquivo não permitido"));
  },
});

// ...Swagger já documentado acima...
router.get("/", listarChamados);

// ...Swagger já documentado acima...
router.get("/:id", buscarChamadoPorId);

// ...Swagger já documentado acima...
router.post(
  "/",
  upload.single("anexo"),
  async (req: Request, res: Response) => {
    try {
      // Extrai campos do body (FormData)
      const {
        titulo,
        tipoChamado,
        tipoMudanca,
        dataExecucao,
        script,
        solicitante,
      } = req.body;

      // Validação dos campos obrigatórios
      if (
        !titulo ||
        !tipoChamado ||
        !tipoMudanca ||
        !dataExecucao ||
        !script ||
        !solicitante
      ) {
        return res
          .status(400)
          .json({ erro: "Campos obrigatórios ausentes.", request: req.body });
      }

      // Validação de descrição de bug
      if (tipoChamado && tipoChamado.toLowerCase() === "bug") {
        const avaliacao = avaliarDescricaoBug(script);
        if (!avaliacao.ok) {
          return res.status(400).json({
            erro: "Descrição insuficiente para chamado de bug.",
            sugestao: avaliacao.sugestao,
          });
        }
      }

      // Processamento do anexo
      let anexoBuffer: Buffer | null = null;
      let anexoNome: string | null = null;
      let anexoTipo: string | null = null;
      if (req.file) {
        anexoBuffer = req.file.buffer;
        anexoNome = req.file.originalname;
        anexoTipo = req.file.mimetype;
      }

      // Chamada ao repository
      try {
        const chamado = await createCalled({
          titulo,
          tipoChamado,
          tipoMudanca,
          dataExecucao,
          script,
          solicitante,
          ambiente: req.body.ambiente || null,
          executor: req.body.executor || null,
          aprovador: req.body.aprovador || null,
          emergencial: req.body.emergencial === "true",
          anexo: anexoBuffer,
          anexo_nome: anexoNome,
          anexo_tipo: anexoTipo,
        });
        return res.status(201).json(chamado);
      } catch (err) {
        const errMsg =
          typeof err === "object" && err !== null && "message" in err
            ? (err as any).message
            : String(err);
        return res
          .status(500)
          .json({ erro: "Erro ao gravar chamado.", detalhes: errMsg });
      }
    } catch (err: any) {
      console.error("Erro interno no POST /api/calleds:", err);
      return res.status(500).json({
        erro: "Erro interno do servidor.",
        detalhes: err?.message || err,
      });
    }
  },
);
/**
 * @swagger
 * /api/calleds/{id}/aprovar:
 *   post:
 *     summary: Aprovar chamado
 *     description: Apenas Analista pode aprovar.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chamado aprovado
 *       403:
 *         description: Apenas Analista pode aprovar
 *       404:
 *         description: Chamado não encontrado
 */
router.post("/:id/aprovar", async (req: Request, res: Response) => {
  const perfil = req.headers["x-perfil"] || "";
  if (perfil !== "Analista") {
    return res.status(403).json({ erro: "Apenas Analista pode aprovar." });
  }
  try {
    // Busca chamado
    const result = await pool.query(
      "SELECT * FROM calleds WHERE id = $1::int",
      [parseInt(req.params.id, 10)],
    );
    const called = result.rows[0];
    if (!called)
      return res.status(404).json({ erro: "Chamado não encontrado." });
    if (called.status !== "Aprovacao" && called.status !== "Criacao") {
      return res
        .status(400)
        .json({ erro: "Chamado não está em etapa de aprovação." });
    }
    // Atualiza status
    const upd = await pool.query(
      "UPDATE calleds SET status = $1 WHERE id = $2::int RETURNING *",
      ["Agendamento", parseInt(req.params.id, 10)],
    );
    console.log(
      `Notificação: chamado ${called.id} agendado para o solicitante ${called.solicitante}`,
    );
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao aprovar chamado." });
  }
});

/**
 * @swagger
 * /api/calleds/{id}/revisar:
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
router.post("/:id/revisar", async (req: Request, res: Response) => {
  const perfil = req.headers["x-perfil"] || "";
  if (perfil !== "Analista") {
    return res
      .status(403)
      .json({ erro: "Apenas Analista pode devolver para revisão." });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM calleds WHERE id = $1::int",
      [parseInt(req.params.id, 10)],
    );
    const called = result.rows[0];
    if (!called)
      return res.status(404).json({ erro: "Chamado não encontrado." });
    if (called.status !== "Aprovacao") {
      return res
        .status(400)
        .json({ erro: "Chamado não está em etapa de aprovação." });
    }
    const upd = await pool.query(
      "UPDATE calleds SET status = $1 WHERE id = $2::int RETURNING *",
      ["Em Revisao", parseInt(req.params.id, 10)],
    );
    console.log(
      `Notificação: chamado ${called.id} devolvido para revisão ao solicitante ${called.solicitante}`,
    );
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao devolver chamado para revisão." });
  }
});

/**
 * @swagger
 * /api/calleds/{id}/reprovar:
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
router.post("/:id/reprovar", async (req: Request, res: Response) => {
  const perfil = req.headers["x-perfil"] || "";
  if (perfil !== "Analista") {
    return res.status(403).json({ erro: "Apenas Analista pode reprovar." });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM calleds WHERE id = $1::int",
      [parseInt(req.params.id, 10)],
    );
    const called = result.rows[0];
    if (!called)
      return res.status(404).json({ erro: "Chamado não encontrado." });
    if (called.status !== "Aprovacao") {
      return res
        .status(400)
        .json({ erro: "Chamado não está em etapa de aprovação." });
    }
    const upd = await pool.query(
      "UPDATE calleds SET status = $1 WHERE id = $2::int RETURNING *",
      ["Reprovado", parseInt(req.params.id, 10)],
    );
    console.log(
      `Notificação: chamado ${called.id} reprovado para o solicitante ${called.solicitante}`,
    );
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao reprovar chamado." });
  }
});

/**
 * @swagger
 * /api/calleds/{id}/agendar:
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
router.post("/:id/agendar", async (req: Request, res: Response) => {
  const perfil = req.headers["x-perfil"] || "";
  if (perfil !== "Analista") {
    return res.status(403).json({ erro: "Apenas Analista pode agendar." });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM calleds WHERE id = $1::int",
      [parseInt(req.params.id, 10)],
    );
    const called = result.rows[0];
    if (!called)
      return res.status(404).json({ erro: "Chamado não encontrado." });
    if (called.status !== "Aprovacao") {
      return res
        .status(400)
        .json({ erro: "Chamado não está em etapa de aprovação." });
    }
    const upd = await pool.query(
      "UPDATE calleds SET status = $1 WHERE id = $2::uuid RETURNING *",
      ["Agendamento", req.params.id],
    );
    console.log(
      `Notificação: chamado ${called.id} agendado para o solicitante ${called.solicitante}`,
    );
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao agendar chamado." });
  }
});

/**
 * @swagger
 * /api/calleds/{id}/executar:
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
router.post("/:id/executar", async (req: Request, res: Response) => {
  const perfil = req.headers["x-perfil"] || "";
  if (perfil !== "Executor") {
    return res.status(403).json({ erro: "Apenas Executor pode executar." });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM calleds WHERE id = $1::uuid",
      [req.params.id],
    );
    const called = result.rows[0];
    if (!called)
      return res.status(404).json({ erro: "Chamado não encontrado." });
    if (called.status !== "Agendamento") {
      return res
        .status(400)
        .json({ erro: "Chamado não está em etapa de agendamento." });
    }
    const upd = await pool.query(
      "UPDATE calleds SET status = $1 WHERE id = $2::int RETURNING *",
      ["Execucao", parseInt(req.params.id, 10)],
    );
    console.log(
      `Notificação: chamado ${called.id} executado para o solicitante ${called.solicitante}`,
    );
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao executar chamado." });
  }
});

export default router;
