import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      runtimeCaching: [
        {
          // Cache all 3D models (GLB/GLTF)
          urlPattern: ({ url }) => url.pathname.endsWith('.glb') || url.pathname.endsWith('.gltf'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'models-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            },
          },
        },
        {
          // Cache textures and icons
          urlPattern: ({ url }) => url.pathname.includes('/images/') || url.pathname.endsWith('.png'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets-cache',
          },
        },
      ],
    },
  }),
  ],
  server: {
    host: '0.0.0.0',       // expose to network
    port: 5173
  }
});