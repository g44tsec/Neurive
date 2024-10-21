self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('game-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/style.css',
          '/script.js',
          '/manifest.json',
          'Neurive.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
