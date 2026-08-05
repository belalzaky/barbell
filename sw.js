/* Barbell service worker.
   BUMP `V` on every release — that is what triggers the update prompt
   and purges the old cache. Nothing else needs changing. */
const V = 'barbell-2026-08-05a';

const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  // No skipWaiting here on purpose: a new version must never swap in
  // mid-session. The page asks the user, then messages us.
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  let url;
  try { url = new URL(r.url); } catch (_) { return; }

  // App shell — cache first so a dead signal never blocks a session,
  // with a quiet background refresh so the next load is current.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(r).then(hit => {
        const net = fetch(r).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(V).then(c => c.put(r, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Fonts — cache on first success. If they never arrive, Inter falls back
  // to SF and JetBrains Mono to SF Mono, both of which are fine.
  if (/(^|\.)(gstatic|googleapis)\.com$/.test(url.hostname)) {
    e.respondWith(
      caches.match(r).then(hit => hit || fetch(r).then(res => {
        const copy = res.clone();
        caches.open(V).then(c => c.put(r, copy));
        return res;
      }).catch(() => hit))
    );
  }
});
