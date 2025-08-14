import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
// jwt removido (uso movido para middleware)

import apiRouter from "./routes/main";
import { authenticateToken } from "./middlewares/authenticateToken";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "UpWorker API",
    version: "1.0.0",
    description: "Documentação da API do UpWorker",
  },
  servers: [
    { url: "http://localhost:3005/", description: "Backend Local (API)" },
    { url: "http://localhost:3010/", description: "Backend Docker (API)" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
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

app.use("/api-docs", cors(), swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Monta todas as rotas da API via roteador central sob /api
app.use("/api", apiRouter);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck da API
 *     description: Retorna mensagem simples para verificar se a API está rodando.
 *     responses:
 *       200:
 *         description: API UpWorker rodando!
 */
app.get("/api/health", (_req: Request, res: Response) => {
  res.send("API UpWorker rodando!");
});

// Middleware de autenticação JWT

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

// authenticateToken agora vem de middlewares/authenticateToken

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
app.get("/api/protegido", authenticateToken, (req: Request, res: Response) => {
  res.json({ mensagem: "Acesso autorizado!", usuario: (req as any).user });
});

// Middleware global de tratamento de erros (após as rotas)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Erro global:", err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
