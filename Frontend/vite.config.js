import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  alias: {
    "@assets": "./src/assets/theme",
  },
  loader: {
    ".js": "jsx",
  },
});
