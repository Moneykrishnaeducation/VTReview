/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '../Backend');
  const env = loadEnv(mode, envDir, '');
  const backendUrl = env.API_URL || 'http://localhost:5000';
  const allowedHostsEnv = env.ALLOWED_HOSTS
    ? env.ALLOWED_HOSTS.split(',')
    : ["process.localhost", "author.localhost", "localhost", ".localhost"];

  return {
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      host: true, // Listen on all addresses, including process.localhost
      allowedHosts: allowedHostsEnv,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  build: {
    outDir: "../Backend/static",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
  },
  };
});
