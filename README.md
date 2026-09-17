# API de Filmes Teste Técnico

API em Node.js + Express que consome a API de metadados de filmes e expõe a rota `GET /filmes` com os filmes já parseados.

## Como rodar

```bash
npm install
npm start          # http://localhost:3000/filmes
npm test           # testes unitários e de rota (node:test)

```

## Rotas

| Método | Rota      | Descrição                          |
| ------ | --------- | ---------------------------------- |
| GET    | `/filmes` | Lista os filmes parseados          |
| GET    | `/health` | Healthcheck                        |

## Parse aplicado a cada filme

- `lucro`: `bilheteria - orcamento`, formatado em string na maior escala possível (ex.: `"$239 milhões"`, `"$1.048 bilhão"`).
- `maiorPremiacao`: nome do prêmio com maior `relevancia`.
- `duracaoSegundos`: `duracao` (minutos) convertida para segundos.
- `notaIMDb`: valor do rating cuja fonte é IMDb, como string.
- `sinopse`: uma única sinopse, priorizando `pt-br`, depois `en`, depois a primeira disponível.
- Removidas as propriedades `locacoes`, `poster` e `trailer`.
- Propriedade `elenco` mantida.

Exemplo de retorno:

```json
{
  "filmes": [
    {
      "titulo": "O Poderoso Chefão",
      "ano": 1972,
      "diretor": "Francis Ford Coppola",
      "genero": ["Crime", "Drama"],
      "elenco": ["Marlon Brando", "Al Pacino", "James Caan"],
      "duracaoSegundos": 10500,
      "notaIMDb": "9.2",
      "lucro": "$239 milhões",
      "maiorPremiacao": "Oscar de Melhor Filme",
      "sinopse": "Um chefão da máfia tenta transferir o controle de seu império clandestino para seu filho relutante."
    }
  ]
}
```

## Estrutura

```
src/
  app.js                    # app Express, 404 e tratamento de erros
  server.js                 # bootstrap do servidor
  config.js                 # configuração via env
  routes/filmes.js          # rota GET /filmes
  services/filmesService.js # consumo da API de metadados
  parsers/filme.js          # regras de parse do filme
  parsers/valorMonetario.js # leitura/formatação de valores monetários
```

Falhas na API de metadados retornam `502` (resposta inválida) ou `504` (timeout/rede).
