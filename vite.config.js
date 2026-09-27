import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "MoneyLog",
        short_name: "MoneyLog",
        description: "Keep your money simple and tracked.",
        lang: "en",
        dir: "ltr",
        display: "standalone",
        start_url: "/",
        scope: "/",
        background_color: "#F6F1E6",
        theme_color: "#1E4637",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Open your spending dashboard",
            url: "/dashboard",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Expenses",
            short_name: "Expenses",
            description: "Browse all expenses",
            url: "/expenses",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
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