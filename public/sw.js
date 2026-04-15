const CACHE_NAME = "ctrlbank-cache-v1";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Instalar SW e pre-cache os assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Limpar caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache-first para estáticos, Network-first para API/Actions
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Excluir tráfego de dev e não-GET
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.includes("hot-update")
  ) {
    return;
  }

  // Network-first para rotas da API e Server Actions
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next/data")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Salva clone no cache para fallback se offline
          const resClone = response.clone();
          caches.open("ctrlbank-api-cache").then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first para Assets estáticos e imagens
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cacheia novas requisições estáticas
        if (response && response.status === 200 && response.type === "basic") {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return response;
      });
    })
  );
});
