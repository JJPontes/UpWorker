
import { Router } from 'express';
import { criarUsuario, listarUsuarios } from '../controllers/usersController';

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cadastro de usuário
 *     description: Cria um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               perfil:
 *                 type: string
 *                 enum: [Analista, Executor]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/', criarUsuario);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários
 *     description: Retorna todos os usuários cadastrados (sem senha).
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', listarUsuarios);

export default router;
