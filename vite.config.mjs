import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 4177,
    strictPort: true,
  },
  preview: {
    port: 4177,
    strictPort: true,
  },
});
