import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Add this to test caching while you are developing
      devOptions: {
        enabled: true
      },
      workbox: {
        // Added svg, json, and webp for better coverage
        globPatterns: ['**/*.{js,css,html,glb,gltf,obj,mtl,png,jpg,svg,json,webp}'],
        // Bumped to 100MB to ensure complex cities are fully cached
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
      },
      // This section is good practice for PWA identification
      manifest: {
        name: 'Innov City',
        short_name: 'Innov',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
      }
    })
  ]
})

