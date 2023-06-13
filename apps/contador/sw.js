const resources = [
    "/",
    "/static/css/global.css",
    "/style.css",
    "/static/js/app.js",
    "/static/js/resetDialog.js",
    "/static/js/onlineDialog.js",
    "/static/js/saveDialog.js",
    "/static/js/sw.js",
    "static/icons/icon-72x72.png",
    "static/icons/icon-96x96.png",
    "static/icons/icon-128x128.png",
    "static/icons/icon-144x144.png",
    "static/icons/icon-152x152.png",
    "static/icons/icon-192x192.png",
    "static/icons/icon-384x384.png",
    "static/icons/icon-512x512.png",
  ]

self.addEventListener('install', event => {
    event.waitUntil(async ()=>{
        const cache = await caches.open('v1')
        await cache.addAll(resources);
    })
})

async function cacheFirst({request}){
    const cacheResponse = await caches.match(request)
    if(cacheResponse)
        return cacheResponse;
    console.log('no catch found')
    const networkResponse = await fetch(request);
    const cache = await caches.open('v1');
    cache.put(request, networkResponse.clone());
    return networkResponse;
}

self.addEventListener("fetch", event => {
    event.respondWith(cacheFirst({
        request: event.request
    }));
});