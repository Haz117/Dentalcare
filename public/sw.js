// Service Worker para DentalCare PWA
const CACHE_NAME = 'dentalcare-v1.0.1';
const STATIC_CACHE = 'dentalcare-static-v2';
const DYNAMIC_CACHE = 'dentalcare-dynamic-v2';

// Archivos críticos para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  // Iconos y assets críticos
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/icon-32x32.svg',
  '/icons/icon-16x16.svg',
  // Fuentes
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// URLs que siempre deben ir a la red primero
const NETWORK_FIRST_URLS = [
  '/api/',
  '/agendar',
  '/admin',
  '/paciente'
];

// URLs que pueden servirse desde cache primero
const CACHE_FIRST_URLS = [
  '/icons/',
  '/screenshots/',
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.woff',
  '.woff2'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Cacheando assets estáticos');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('✅ Service Worker instalado correctamente');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Error durante la instalación:', error);
    })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Eliminando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activado');
      return self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests de extensiones del navegador
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }

  // Strategy: Network First para APIs y páginas dinámicas
  if (NETWORK_FIRST_URLS.some(path => url.pathname.includes(path))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy: Cache First para assets estáticos
  if (CACHE_FIRST_URLS.some(ext => url.pathname.includes(ext))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy: Stale While Revalidate para el resto
  event.respondWith(staleWhileRevalidate(request));
});

// Estrategia: Network First
async function networkFirst(request) {
  try {
    console.log('🌐 Network First:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📱 Fallback a cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para páginas
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

// Estrategia: Cache First
async function cacheFirst(request) {
  console.log('💾 Cache First:', request.url);
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('❌ Error en Cache First:', error);
    throw error;
  }
}

// Estrategia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  console.log('🔄 Stale While Revalidate:', request.url);
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    console.log('🚫 Network failed for:', request.url);
  });
  
  return cachedResponse || networkPromise;
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

// Push Notifications (para futuras implementaciones)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/badge-72x72.svg',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'Ver Cita',
        icon: '/icons/calendar-icon.svg'
      },
      {
        action: 'dismiss',
        title: 'Descartar'
      }
    ],
    vibrate: [200, 100, 200],
    tag: data.tag || 'dentalcare-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' && data.url) {
    event.waitUntil(
      clients.openWindow(data.url)
    );
  } else if (!action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});