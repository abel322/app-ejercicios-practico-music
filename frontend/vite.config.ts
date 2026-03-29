import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['vite.svg', 'icons/*.png'],
    manifest: {
      name: 'Music Practice PWA',
      short_name: 'MusicPractice',
      description: 'Gestiona tus sesiones de práctica musical',
      theme_color: '#5E35B1',
      background_color: '#5E35B1',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      // Precache static assets
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      
      // Navigation fallback
      navigateFallback: null, // Deshabilitamos el fallback automático para manejarlo manualmente
      
      // Runtime caching strategies
      runtimeCaching: [
        // Cache PDFs with CacheFirst strategy
        {
          urlPattern: /\.pdf$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'pdf-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        // Cache API responses with NetworkFirst strategy
        {
          urlPattern: /^https?:\/\/.*\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 5 * 60, // 5 minutes
            },
            networkTimeoutSeconds: 10,
          },
        },
        // Cache images with CacheFirst strategy
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        // Cache fonts and CSS with StaleWhileRevalidate
        {
          urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'font-cache',
          },
        },
        {
          urlPattern: /\.css$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'css-cache',
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  }), cloudflare()],
})