importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "pwa-cache-v1";
const OFFLINE_PAGE = "/offline.html";

// تفعيل التحديث الفوري
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_PAGE,
        "/", // الصفحة الرئيسية
        "/index.html", // ملف الصفحة
      ]);
    })
  );
});

// تنشيط الخدمة وتجاوز الكاش القديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
      await self.clients.claim();
    })()
  );
});

// دعم التصفح المسبق
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// التعامل مع الطلبات
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;
          if (preloadResp) return preloadResp;

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResp = await cache.match(OFFLINE_PAGE);
          return cachedResp;
        }
      })()
    );
  }
});

// دعم SKIP_WAITING عند الإرسال من صفحة HTML
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
