import express from 'express';
import { filmesRouter } from './routes/filmes.js';
import { FilmesApiError } from './services/filmesService.js';

export const criaApp = () => {
  const app = express();

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use(filmesRouter);

  app.use((_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

  app.use((erro, _req, res, _next) => {
    const status = erro instanceof FilmesApiError ? erro.status : 500;
    if (status >= 500) console.error(erro);
    res.status(status).json({ erro: erro.message ?? 'Erro interno.' });
  });

  return app;
};
