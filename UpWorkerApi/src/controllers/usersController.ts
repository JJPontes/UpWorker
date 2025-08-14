import { Request, Response } from "express";
import {
  findAllUsers,
  findUserByEmail,
  createUser,
} from "../repositories/usersRepository";

export async function listarUsuarios(_req: Request, res: Response) {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
}

export async function criarUsuario(req: Request, res: Response) {
  const { nome, email, senha, perfil } = req.body;
  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }
  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const { v4: uuidv4 } = require("uuid");
    const id = uuidv4();
    const user = await createUser({ id, nome, email, senhaHash, perfil });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
}
