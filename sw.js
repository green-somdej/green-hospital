/*
 * Service worker ของแอป Green Hospital
 * - เก็บไฟล์หน้าเว็บไว้ในเครื่อง เพื่อให้เปิดแอปได้แม้ไม่มีอินเทอร์เน็ต
 * - ตอนออนไลน์จะโหลดไฟล์ล่าสุดจากเซิร์ฟเวอร์ก่อนเสมอ แก้ index.html แล้วผู้ใช้เห็นทันที
 * - ข้อมูลจาก Google Sheet ไม่ได้เก็บที่นี่ หน้าเว็บเก็บเองใน localStorage
 * ถ้าเพิ่มหรือเปลี่ยนชื่อไฟล์ ให้เปลี่ยนเลข VERSION ด้วย
 */
const VERSION = 'gh-v1';
const SHELL = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== VERSION + '-fonts').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // ไฟล์ของเว็บเอง: ใช้ของใหม่จากเครือข่ายก่อน ถ้าออฟไลน์จึงใช้ของที่เก็บไว้
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
      )
    );
    return;
  }

  // ฟอนต์ Google: ใช้ของในเครื่องก่อน แล้วอัปเดตเบื้องหลัง
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(VERSION + '-fonts').then(c => c.match(req).then(hit => {
        const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
  // อย่างอื่น (Apps Script, รูปจาก Google Drive) ปล่อยผ่านตามปกติ
});
