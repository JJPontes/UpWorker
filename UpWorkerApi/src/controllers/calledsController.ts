import { Request, Response } from 'express';
import { findAllCalleds, findCalledById } from '../repositories/calledsRepository';

export async function listarChamados(req: Request, res: Response) {
  const { status, solicitante, page = '1', pageSize = '10' } = req.query;
  try {
    const chamados = await findAllCalleds({
      status: status as string,
      solicitante: solicitante as string,
      page: parseInt(page as string, 10),
      pageSize: parseInt(page as string, 10)
    });
    res.json(chamados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar chamados.' });
  }
}

export async function buscarChamadoPorId(req: Request, res: Response) {
  try {
    const chamado = await findCalledById(req.params.id);
    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    res.json(chamado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar chamado.' });
  }
}
