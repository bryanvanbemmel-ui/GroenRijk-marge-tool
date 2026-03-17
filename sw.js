
const CACHE_NAME = "marge-tool-v2";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {

  // HTML altijd vers ophalen (BELANGRIJK)
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request));
    return;
  }

  // overige bestanden cachen
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );

});
