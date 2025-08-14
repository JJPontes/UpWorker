import { Router, Request, Response } from 'express';
import { avaliarDescricaoBug } from '../controllers/bugAnalyzeController';

const router = Router();


/**
 * @swagger
 * /bugAnalyze:
 *   post:
 *     summary: Analisar descrição de bug
 *     description: Avalia a descrição de um bug e retorna sugestões de melhoria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestões de melhoria (se houver)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Descrição não informada
 */
router.post('/', async (req: Request, res: Response) => {
  const { description } = req.body;
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ suggestions: ["Descrição não informada."] });
  }
  const result = avaliarDescricaoBug(description);
  if (result.ok) {
    return res.json({ suggestions: [] });
  } else {
    return res.json({ suggestions: [result.sugestao || "Melhore a descrição do bug."] });
  }
});

export default router;
