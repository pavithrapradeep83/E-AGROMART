// Service Worker for Farmer Market PWA
// Version bumped to force cache invalidation
const CACHE_NAME = 'farmer-market-v' + new Date().getTime();
const urlsToCache = [
    '/css/style.css',
    '/js/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap'
];

// List of HTML files that should NEVER be cached
const HTML_FILES = [
    '/index.html',
    '/login.html',
    '/register.html',
    '/farmer.html',
    '/buyer.html',
    '/admin.html',
    '/payment.html',
    '/invoice.html',
    '/profile.html',
    '/wishlist.html'
];

// Service Worker Install Event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.log('Cache addAll failed:', error);
            })
    );
    
    // Force new service worker to become active immediately
    self.skipWaiting();
});

// Service Worker Activate Event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Claim clients immediately
    self.clients.claim();
});

// Service Worker Fetch Event - Offline Support
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Skip API calls - always fetch fresh
    if (event.request.url.includes('/api/')) {
        return event.respondWith(fetch(event.request));
    }

    // For HTML files: Network first, fall back to cache
    if (HTML_FILES.some(html => event.request.url.includes(html))) {
        return event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }

    // For other files (CSS, JS, images): Cache first, fall back to network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache successful responses for offline use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page or cached response
                        return caches.match(event.request)
                            .then((cachedResponse) => {
                                return cachedResponse || new Response('Offline - Resource not available', {
                                    status: 503,
                                    statusText: 'Service Unavailable',
                                    headers: new Headers({
                                        'Content-Type': 'text/plain'
                                    })
                                });
                            });
                    });
            })
    );
});

// Background Sync Support
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncOrders() {
    try {
        // Sync pending orders when connection is restored
        const cache = await caches.open(CACHE_NAME);
        const response = await fetch('/api/orders');
        
        if (response.ok) {
            await cache.put('/api/orders', response.clone());
            
            // Notify all clients
            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
                client.postMessage({
                    type: 'SYNC_COMPLETE',
                    message: 'Orders synced successfully'
                });
            });
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

// Push Notifications Support
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%232e7d32" width="192" height="192"/><text x="50%" y="50%" font-size="80" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-weight="bold">FM</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%232e7d32" width="192" height="192"/></svg>',
        tag: data.tag || 'notification',
        requireInteraction: data.requireInteraction || false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Farmer Market', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open with the target URL
                for (let client of clientList) {
                    if (client.url === event.notification.data?.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, open a new window
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data?.url || '/');
                }
            })
    );
});
