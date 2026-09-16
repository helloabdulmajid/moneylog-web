import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
     allowedHosts: ['localui.abdulmajid.in', '.abdulmajid.in'],
    proxy: {
      "/auth": "http://localhost:8080",
      "/expenses": "http://localhost:8080",
      "/categories": "http://localhost:8080",
      "/payment": "http://localhost:8080",
    },
  },
});
