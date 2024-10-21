// Service Worker

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

// Add display rules for hub-container and intro-hub in cache
self.addEventListener('message', function(event) {
    if (event.data === 'applyCSS') {
        applyInitialCSS();
    }
});

function applyInitialCSS() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`
        .hub-container {
            display: none; /* Hide the game hub initially */
        }

        #intro-hub {
            display: block; /* Show the intro hub initially */
        }
    `);

    document.adoptedStyleSheets = [styleSheet];
}
