const CACHE_NAME = 'quranic-wisdom-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin === 'https://checkout.razorpay.com' || url.origin === 'https://api.razorpay.com') {
    return;
  }

  if (url.pathname.startsWith('/functions/v1/')) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  const isAsset = url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|webp|woff2?)$/);

  if (isAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          fetch(event.request)
            .then((response) => {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));
            })
            .catch(() => {});
          return cached;
        }
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { hour, minute } = event.data;
    scheduleNotification(hour, minute);
  }
});

let notificationTimer = null;

function scheduleNotification(hour, minute) {
  if (notificationTimer) clearTimeout(notificationTimer);

  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  notificationTimer = setTimeout(() => {
    self.registration.showNotification('Daily Quranic Wisdom', {
      body: 'Your daily verse and reflection is ready.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'daily-wisdom',
      renotify: true,
    });
    scheduleNotification(hour, minute);
  }, delay);
}
