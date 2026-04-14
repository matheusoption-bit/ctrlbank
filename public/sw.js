self.addEventListener('install', (event) => {
  console.log('SW: Install event');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activate event');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Básico: Bypass, deixando o browser resolver (Cache de Next.js lida com boa parte online)
  // Futuramente podemos adicionar estratégias de stale-while-revalidate aqui.
});
