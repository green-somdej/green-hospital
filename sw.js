/* Service worker — ทำให้ติดตั้งเป็นแอปได้ และเปิดหน้าแอปได้เร็วแม้เน็ตช้า
 * เปลี่ยนเลข VERSION ทุกครั้งที่แก้ไฟล์หน้าเว็บ เพื่อให้เครื่องผู้ใช้โหลดของใหม่ */
const VERSION = 'gs-v2.6.0';
const V = '?v=2.6.0';
const SHELL = [
  './',
  './index.html',
  './styles.css' + V,
  './app.js' + V,
  './config.js' + V,
  './mock-api.js' + V,
  './manifest.webmanifest',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './mascot/leelawadee-main.jpg',
  './mascot/leelawadee-wave.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // API (POST) ไม่แคช
  const url = new URL(req.url);
  if (/script\.google(usercontent)?\.com$/.test(url.hostname)) return;

  // หน้าเว็บ/ไฟล์แอป: ใช้ของใหม่จากเน็ตก่อน ถ้าออฟไลน์ค่อยใช้ของในแคช
  if (req.mode === 'navigate' || url.origin === location.origin) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // ไฟล์ภายนอก (ฟอนต์, ไลบรารี QR): ใช้แคชก่อน
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
