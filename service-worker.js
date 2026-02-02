const CACHE_NAME = 'app-shell-v2.5'
const BASE = '/smart-travel-companion';

const APP_SHELL = [
    `${BASE}/`,
    `${BASE}/index.html`,
    `${BASE}/manifest.json`
];

self.addEventListener('install', (event) => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

/*
  IMPORTANT:
  Do NOT intercept fetch yet.
  This prevents breaking Vite dev server.
*/

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Navigation (SPA)
    if (request.mode === 'navigate') {
        event.respondWith(
            caches.match('/index.html')
                .then(cached => cached || fetch(request))
        );
        return;
    }

    // Static assets
    if (request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'image') {

        event.respondWith(
            caches.match(request).then(cached => {
                return cached || fetch(request).then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});
