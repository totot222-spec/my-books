const CACHE="my-books-v2";
const ASSETS=["./","./index.html","./manifest.json"];

self.addEventListener("install",e=>{
 self.skipWaiting();
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener("activate",e=>{
 e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
 );
 self.clients.claim();
});

// ネットワークを優先し、取得できた最新版を常にキャッシュへ保存。
// オフライン時だけキャッシュ済みの内容にフォールバックする。
self.addEventListener("fetch",e=>{
 e.respondWith(
  fetch(e.request).then(res=>{
   const copy=res.clone();
   caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
   return res;
  }).catch(()=>caches.match(e.request))
 );
});
