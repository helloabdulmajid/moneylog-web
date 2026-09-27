import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MoneyLog",
        short_name: "MoneyLog",
        description: "Track expenses, cards, and bills in one place.",
        theme_color: "#1E4637",
        background_color: "#F7F7F2",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkOnly",
            method: "GET",
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 5173,
    allowedHosts: ["localui.abdulmajid.in", ".abdulmajid.in"],
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  preview: {
    port: 5173,
    allowedHosts: ["localui.abdulmajid.in", ".abdulmajid.in"],
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
