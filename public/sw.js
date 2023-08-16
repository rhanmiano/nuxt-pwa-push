import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import * as navigationPreload from 'workbox-navigation-preload';

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

try {
  const handler = createHandlerBoundToURL('/');
  const route = new NavigationRoute(handler);
  registerRoute(route);
} catch (error) {
  console.warn('Error while registering cache route', { error });
}/* 

const CACHE = "pwabuilder-page";
const offlineFallbackPage = "offline.html";

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (navigationPreload.isSupported()) {
  navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
}); */

self.addEventListener('push', function(event) {
  let promiseChain = null;
  if (event.data) {
    console.log('This push event has data: ', event.data.json());
    const { title, body } = event.data.json()
    promiseChain = self.registration.showNotification(title, {
      body,
      icon: '/favicon-32x32.png'
    });

    
  } else {
    console.log('This push event has no data.');
  }

  if (promiseChain) {
    event.waitUntil(promiseChain);
  }
});