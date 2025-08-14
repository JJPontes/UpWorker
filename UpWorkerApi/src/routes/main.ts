import { Router } from "express";
import calledsRouter from "./calleds";
import usersRouter from "./users";
import authRouter from "./auth";
import bugAnalyzeRouter from "./bugAnalyze";

// Roteador central para agregar as rotas da aplicação
const router = Router();

router.use("/calleds", calledsRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/bugAnalyze", bugAnalyzeRouter);

export default router;
