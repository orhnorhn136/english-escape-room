// Network-first, ağ yoksa önbellek. Yalnızca aynı origin'den GET istekleri önbelleğe alınır.
const CACHE = 'escape-room-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        const shell = await cache.match(self.registration.scope);
        return shell ?? Response.error();
      }
    })(),
  );
});
