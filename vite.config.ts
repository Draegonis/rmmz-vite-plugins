import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  worker: {
    format: "es",
  },
  server: {
    open: true,
    port: 8558,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          db: ["zustand", "immer", "pako", "idb-keyval"],
          util: ["zod", "uuid", "ramda"],
        },
      },
    },
    target: "ES2021",
  },
});
