const CACHE_NAME = 'einkaufsliste-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/script.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

// Installieren des Service Workers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Anfragen abfangen
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});