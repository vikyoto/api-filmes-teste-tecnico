export const config = {
  port: Number(process.env.PORT ?? 3000),
  filmesApiUrl:
    process.env.FILMES_API_URL ??
    'https://tv5hn2gvyijpl76yxlmsy66jwa0nlmxn.lambda-url.us-east-1.on.aws/',
  filmesApiTimeoutMs: Number(process.env.FILMES_API_TIMEOUT_MS ?? 10000)
};
