import { criaApp } from './app.js';
import { config } from './config.js';

criaApp().listen(config.port, () => {
  console.log(`API de filmes ouvindo em http://localhost:${config.port}/filmes`);
});
