import { Router } from 'express';
import { buscaFilmes } from '../services/filmesService.js';

export const filmesRouter = Router();

filmesRouter.get('/filmes', async (_req, res, next) => {
  try {
    res.json({ filmes: await buscaFilmes() });
  } catch (erro) {
    next(erro);
  }
});
