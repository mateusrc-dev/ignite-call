/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'], // vamos colocar a extensão de arquivos que vão ser rotas na nossa aplicação (para que styles.ts não se torne uma rota)
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
