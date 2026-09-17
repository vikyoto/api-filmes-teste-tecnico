const ESCALAS = [
  { regex: /trilh(ao|ão|oes|ões)/, multiplicador: 1e12, singular: 'trilhão', plural: 'trilhões' },
  { regex: /bilh(ao|ão|oes|ões)/, multiplicador: 1e9, singular: 'bilhão', plural: 'bilhões' },
  { regex: /milh(ao|ão|oes|ões)/, multiplicador: 1e6, singular: 'milhão', plural: 'milhões' },
  { regex: /\bmil\b/, multiplicador: 1e3, singular: 'mil', plural: 'mil' }
];

const semAcentos = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const numeroDoTexto = (texto) => {
  const bruto = texto.replace(/[^\d.,]/g, '');
  if (!bruto) return null;

  const ultimaVirgula = bruto.lastIndexOf(',');
  const ultimoPonto = bruto.lastIndexOf('.');
  const separadorDecimal = ultimaVirgula > ultimoPonto ? ',' : '.';
  const [inteiro, decimal = ''] = bruto.split(separadorDecimal === ',' ? /,(?=[^,]*$)/ : /\.(?=[^.]*$)/);

  const normalizado = `${inteiro.replace(/[.,]/g, '')}${decimal ? `.${decimal}` : ''}`;
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
};

export const simboloMoeda = (texto) => (typeof texto === 'string' && texto.match(/[$€£R]\$?/)?.[0]) ?? '$';

export const parseValorMonetario = (texto) => {
  if (typeof texto === 'number') return Number.isFinite(texto) ? texto : null;
  if (typeof texto !== 'string') return null;

  const numero = numeroDoTexto(texto);
  if (numero === null) return null;

  const normalizado = semAcentos(texto.toLowerCase());
  const escala = ESCALAS.find(({ regex }) => regex.test(semAcentos(normalizado)) || regex.test(normalizado));
  const negativo = /^\s*-/.test(texto);

  return (negativo ? -1 : 1) * Math.abs(numero) * (escala?.multiplicador ?? 1);
};

const formataNumero = (valor) => {
  const arredondado = Number(valor.toFixed(3));
  return String(arredondado);
};

export const formataValorMonetario = (valor, moeda = '$') => {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) return null;

  const sinal = valor < 0 ? '-' : '';
  const absoluto = Math.abs(valor);
  const escala = ESCALAS.find(({ multiplicador }) => absoluto >= multiplicador);

  if (!escala) return `${sinal}${moeda}${formataNumero(absoluto)}`;

  const escalado = absoluto / escala.multiplicador;
  const unidade = Number(escalado.toFixed(3)) < 2 ? escala.singular : escala.plural;
  return `${sinal}${moeda}${formataNumero(escalado)} ${unidade}`;
};
