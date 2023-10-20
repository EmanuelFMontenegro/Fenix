import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './src/main.jsx',
        deteccionFacial: './src/components/deteccionFacial.jsx', // Ruta relativa desde la raíz del proyecto
      },
    },
  },
  alias: {
    "@assets": "./src/assets/theme",
  },
  loader: {
    ".js": "jsx",
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000',}},
});