import { Request, Response } from "express";
import {
  findAllCalleds,
  findCalledById,
} from "../repositories/calledsRepository";

export async function listarChamados(req: Request, res: Response) {
  const { status, solicitante, dataInicio, dataFim, page = "1", pageSize = "10" } = req.query;
  try {
    const chamados = await findAllCalleds({
      status: status as string,
      solicitante: solicitante as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      page: parseInt(page as string, 10),
      pageSize: parseInt(pageSize as string, 10),
    });
  res.json({ data: chamados });
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: "Erro ao listar chamados." });
  }
}

export async function buscarChamadoPorId(req: Request, res: Response) {
  try {
    const chamado = await findCalledById(Number(req.params.id));
    if (!chamado)
  return res.status(404).json({ error: "Chamado não encontrado." });
  res.json({ data: chamado });
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: "Erro ao buscar chamado." });
  }
}
