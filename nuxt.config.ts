// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@vite-pwa/nuxt',
  ],
  ssr: false,
  pwa: {
    strategies: 'injectManifest',
    registerType: 'autoUpdate',
    manifest: {
      "name": "test-nuxt-pwa-app",
      "short_name": "Test Nuxt PWA App",
      "icons": [
        {
          "src":"/android-chrome-192x192.png",
          "sizes":"192x192",
          "type":"image/png"
        },
        {
          "src":"/android-chrome-512x512.png",
          "sizes":"512x512",
          "type":"image/png"
        }
      ],
      "theme_color":"#ffffff",
      "background_color":"#ffffff",
      "display":"standalone"
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      vapidPrivateKey: process.env.NUXT_PUBLIC_VAPID_PRIVATE_KEY,
    }
  },
})
