const CACHE="my-books-v6";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html","./manifest.json"])))});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(e.request.method==="GET" && (e.request.mode==="navigate" || u.pathname.endsWith("/index.html"))){
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
 } else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});