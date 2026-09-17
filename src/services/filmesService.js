import { config } from '../config.js';
import { parseFilmes } from '../parsers/filme.js';

export class FilmesApiError extends Error {
  constructor(message, { status = 502, cause } = {}) {
    super(message, { cause });
    this.name = 'FilmesApiError';
    this.status = status;
  }
}

export const buscaFilmes = async ({ fetchImpl = fetch } = {}) => {
  let resposta;

  try {
    resposta = await fetchImpl(config.filmesApiUrl, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(config.filmesApiTimeoutMs)
    });
  } catch (erro) {
    throw new FilmesApiError('Não foi possível consultar a API de metadados de filmes.', {
      status: 504,
      cause: erro
    });
  }

  if (!resposta.ok) {
    throw new FilmesApiError(
      `A API de metadados de filmes respondeu com status ${resposta.status}.`
    );
  }

  const corpo = await resposta.json();
  return parseFilmes(corpo?.filmes);
};
