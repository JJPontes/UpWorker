import pool from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Cadastro incompleto." });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ erro: "Credenciais inválidas." });
    const senhaOk = await bcrypt.compare(senha, user.senha);
    if (!senhaOk)
      return res.status(401).json({ erro: "Credenciais inválidas." });
    const token = jwt.sign(
      { id: user.id, nome: user.nome, perfil: user.perfil },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1d" },
    );
    res.json({ token, nome: user.nome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro interno." });
  }
}

// ...outros métodos podem ser migrados aqui, como registro, atualização, etc.
