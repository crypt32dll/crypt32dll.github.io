/* Runtime cache for hashed Next assets + images.
 * GitHub Pages only sends Cache-Control: max-age=600 — this keeps repeat visits fast.
 * Does not change Lighthouse "efficient cache lifetimes" (that audit reads HTTP headers).
 */
const CACHE = 'fs-static-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

function shouldCache(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/images/'))
  )
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (!shouldCache(url)) return

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request)
      if (cached) return cached
      try {
        const response = await fetch(request)
        if (response.ok) cache.put(request, response.clone())
        return response
      } catch (err) {
        const fallback = await cache.match(request)
        if (fallback) return fallback
        throw err
      }
    }),
  )
})
