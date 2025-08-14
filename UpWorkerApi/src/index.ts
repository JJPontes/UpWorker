
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import jwt from 'jsonwebtoken';

import calledsRouter from './routes/calleds';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import bugAnalyzeRouter from './routes/bugAnalyze';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'UpWorker API',
    version: '1.0.0',
    description: 'Documentação da API do UpWorker',
  },
  servers: [
    { url: 'http://localhost:3005', description: 'Backend Local' },
    { url: 'http://localhost:3010', description: 'Backend Docker' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

const app = express();
app.use(cors());
const PORT = process.env.PORT ? Number(process.env.PORT) : 3010;

app.use(express.json());

// Log de todas as requisições recebidas
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Log de erros globais
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro global:', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/calleds', calledsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/bugAnalyze', bugAnalyzeRouter);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Healthcheck da API
 *     description: Retorna mensagem simples para verificar se a API está rodando.
 *     responses:
 *       200:
 *         description: API UpWorker rodando!
 */
app.get('/', (_req: Request, res: Response) => {
  res.send('API UpWorker rodando!');
});

// Middleware de autenticação JWT
// (Removido: implementação duplicada)

/**
 * @swagger
 * /protegido:
 *   get:
 *     summary: Exemplo de rota protegida
 *     description: Retorna mensagem e dados do usuário autenticado. Requer autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Token ausente ou inválido
 */
app.get('/protegido', authenticateToken, (req: Request, res: Response) => {
  res.json({ mensagem: 'Acesso autorizado!', usuario: (req as any).user });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});

// Log de todas as requisições recebidas
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// Log de erros globais
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro global:', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/calleds', calledsRouter);
app.use('/users', usersRouter);

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
 *
 * /users/update-name:
 *   put:
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
 *
 * /calleds:
 *   get:
 *     summary: Lista todos os chamados
 *     description: Retorna todos os chamados cadastrados
 *     responses:
 *       200:
 *         description: Lista de chamados
 *   post:
 *     summary: Cria um novo chamado
 *     description: Adiciona um chamado ao sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Chamado criado
 *       400:
 *         description: Dados inválidos
 *
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna todos os usuários cadastrados
 *     responses:
 *       200:
 *         description: Lista de usuários
 *   post:
 *     summary: Cria um novo usuário
 *     description: Adiciona um usuário ao sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Dados inválidos
 *
 * /protegido:
 *   get:
 *     summary: Exemplo de rota protegida
 *     description: Retorna mensagem e dados do usuário autenticado. Requer autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Token ausente ou inválido
 *
 * /:
 *   get:
 *     summary: Healthcheck da API
 *     description: Retorna mensagem simples para verificar se a API está rodando.
 *     responses:
 *       200:
 *         description: API UpWorker rodando!
 */
app.use('/auth', authRouter);


/**
 * @swagger
 * /:
 *   get:
 *     summary: Healthcheck da API
 *     description: Retorna mensagem simples para verificar se a API está rodando.
 *     responses:
 *       200:
 *         description: API UpWorker rodando!
 */
app.get('/', (_req: Request, res: Response) => {
  res.send('API UpWorker rodando!');
});

// Middleware de autenticação JWT
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'changeme', (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
}

/**
 * @swagger
 * /protegido:
 *   get:
 *     summary: Exemplo de rota protegida
 *     description: Retorna mensagem e dados do usuário autenticado. Requer autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Token ausente ou inválido
 */
app.get('/protegido', authenticateToken, (req: Request, res: Response) => {
  res.json({ mensagem: 'Acesso autorizado!', usuario: (req as any).user });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
