/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: '/transacoes',
        destination: '/caixa',
        permanent: true,
      },
      {
        source: '/orcamentos',
        destination: '/metas',
        permanent: true,
      },
      {
        source: '/categorias',
        destination: '/configuracoes',
        permanent: true,
      },
      {
        source: '/recorrentes',
        destination: '/configuracoes',
        permanent: true,
      },
      {
        source: '/integracoes',
        destination: '/configuracoes',
        permanent: true,
      },
      {
        source: '/perfil',
        destination: '/configuracoes',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
