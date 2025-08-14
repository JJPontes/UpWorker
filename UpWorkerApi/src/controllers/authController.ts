
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import * as usersRepository from "../repositories/usersRepository";

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) {
  return res.status(400).json({ error: "Cadastro incompleto." });
  }
  try {
    const user = await usersRepository.findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas." });
    const senhaOk = await bcrypt.compare(senha, user.senha);
    if (!senhaOk)
      return res.status(401).json({ error: "Credenciais inválidas." });
    const token = jwt.sign(
      { id: user.id, nome: user.nome, perfil: user.perfil },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1d" },
    );
    res.status(200).json({ data: { token, nome: user.nome } });
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: "Erro interno." });
  }
}

// ...outros métodos podem ser migrados aqui, como registro, atualização, etc.
