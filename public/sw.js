import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

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
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

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