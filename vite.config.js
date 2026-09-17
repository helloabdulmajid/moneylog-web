import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
     allowedHosts: ['localui.abdulmajid.in', '.abdulmajid.in'],
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
