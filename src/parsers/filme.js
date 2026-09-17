import { formataValorMonetario, parseValorMonetario, simboloMoeda } from './valorMonetario.js';

const SEGUNDOS_POR_MINUTO = 60;
const PRIORIDADE_IDIOMAS = ['pt-br', 'pt', 'en'];

export const calculaLucro = (orcamento, bilheteria) => {
  const orcamentoNumerico = parseValorMonetario(orcamento);
  const bilheteriaNumerica = parseValorMonetario(bilheteria);
  if (orcamentoNumerico === null || bilheteriaNumerica === null) return null;

  return formataValorMonetario(
    bilheteriaNumerica - orcamentoNumerico,
    simboloMoeda(bilheteria) ?? simboloMoeda(orcamento)
  );
};

export const maiorPremiacao = (premios) => {
  if (!Array.isArray(premios) || premios.length === 0) return null;

  const vencedor = premios.reduce((melhor, premio) => {
    const relevancia = Number(premio?.relevancia ?? Number.NEGATIVE_INFINITY);
    const melhorRelevancia = Number(melhor?.relevancia ?? Number.NEGATIVE_INFINITY);
    return relevancia > melhorRelevancia ? premio : melhor;
  });

  return vencedor?.nome ?? null;
};

export const duracaoEmSegundos = (duracaoEmMinutos) => {
  const minutos = Number(duracaoEmMinutos);
  return Number.isFinite(minutos) ? minutos * SEGUNDOS_POR_MINUTO : null;
};

export const notaIMDb = (ratings) => {
  const imdb = Array.isArray(ratings)
    ? ratings.find((rating) => String(rating?.fonte ?? '').toLowerCase() === 'imdb')
    : undefined;

  return imdb?.valor === undefined || imdb?.valor === null ? null : String(imdb.valor);
};

export const sinopsePreferida = (sinopses) => {
  if (!Array.isArray(sinopses) || sinopses.length === 0) return null;

  const porIdioma = (idioma) =>
    sinopses.find((sinopse) => String(sinopse?.idioma ?? '').toLowerCase() === idioma);

  const escolhida = PRIORIDADE_IDIOMAS.map(porIdioma).find(Boolean) ?? sinopses[0];
  return escolhida?.texto ?? null;
};

export const parseFilme = (filme) => ({
  titulo: filme.titulo,
  ano: filme.ano,
  diretor: filme.diretor,
  genero: filme.genero,
  elenco: filme.elenco,
  duracaoSegundos: duracaoEmSegundos(filme.duracao),
  notaIMDb: notaIMDb(filme.ratings),
  lucro: calculaLucro(filme.orcamento, filme.bilheteria),
  maiorPremiacao: maiorPremiacao(filme.premios),
  sinopse: sinopsePreferida(filme.sinopse)
});

export const parseFilmes = (filmes) => (Array.isArray(filmes) ? filmes.map(parseFilme) : []);
