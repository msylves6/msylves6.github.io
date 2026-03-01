// @ts-nocheck
/// <reference lib="webworker" />

// Load Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.2/workbox-sw.js');

if (workbox) {
  console.log("Workbox loaded successfully");

  // Force service worker to activate immediately
  self.skipWaiting();
  self.clientsClaim();

  // Precache manifest
  workbox.precaching.precacheAndRoute([
    { url: '/_next/static/6Qn6zTBctj6i_gkn9WdkD/_buildManifest.js', revision: '4de6b438a6b7d7716b507ef1d060b882' },
    { url: '/_next/static/6Qn6zTBctj6i_gkn9WdkD/_ssgManifest.js', revision: 'b6652df95db52feb4daf4eca35380933' },
    // Add all other precache entries here
  ], { ignoreURLParametersMatching: [] });

  // Clean old caches
  workbox.precaching.cleanupOutdatedCaches();

  // Cache the start URL
  workbox.routing.registerRoute(
    '/',
    new workbox.strategies.NetworkFirst({
      cacheName: 'start-url',
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            if (response && response.type === 'opaqueredirect') {
              return new Response(response.body, {
                status: 200,
                statusText: 'OK',
                headers: response.headers,
              });
            }
            return response;
          },
        },
      ],
    })
  );

  // Google Fonts
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        }),
      ],
    })
  );

  // Images
  workbox.routing.registerRoute(
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Videos
  workbox.routing.registerRoute(
    /\.(?:mp4|webm)$/i,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-videos',
      plugins: [
        new workbox.rangeRequests.RangeRequestsPlugin(),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

} else {
  console.log("Workbox didn't load");
}