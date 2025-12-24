// app/sw.ts
// This file will be processed by Serwist.
// You can add custom service worker logic here if needed.
// For basic caching and offline support, Serwist handles most things.

import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (import("serwist").PrecacheEntry | string)[];
};

precacheAndRoute(self.__SW_MANIFEST || []);

// You can also add custom routing:
// import { registerRoute } from 'workbox-routing';
// import { NetworkFirst } from 'workbox-strategies';
// registerRoute(
//   ({ request }) => request.mode === 'navigate',
//   new NetworkFirst({
//     cacheName: 'pages-cache',
//   })
// );