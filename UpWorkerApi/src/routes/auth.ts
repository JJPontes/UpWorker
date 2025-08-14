/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Rotas de autenticação
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Autenticação de usuário
 *     description: Realiza login e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 nome:
 *                   type: string
 *       400:
 *         description: Cadastro incompleto
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 *
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout do usuário
 *     description: Invalida o token JWT do usuário (exemplo, depende da implementação).
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido
 *
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Renova o token JWT
 *     description: Retorna um novo token JWT válido (exemplo, depende da implementação).
 *     responses:
 *       200:
 *         description: Token renovado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Token inválido
 *
 * /users/update-name:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Atualiza o nome do usuário autenticado
 *     description: Atualiza o campo nome do usuário logado. Requer autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nome atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 nome:
 *                   type: string
 *       400:
 *         description: Nome não pode ser vazio
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro ao atualizar nome
 */


import { Router } from 'express';
import { login } from '../controllers/authController';
const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: Realiza login e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 nome:
 *                   type: string
 *       400:
 *         description: Cadastro incompleto
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 */
router.post('/login', login);

export default router;
