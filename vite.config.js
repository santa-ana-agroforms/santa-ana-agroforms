import { fileURLToPath, URL } from "url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import monacoEditorPluginModule from "vite-plugin-monaco-editor";

const monacoEditorPlugin =
  monacoEditorPluginModule.default || monacoEditorPluginModule;

const __filename = fileURLToPath(import.meta.url);

const DEV_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' ws: wss: http://localhost:5173 https://santa-ana-api.onrender.com https://unexpected-janine-uvg-9d84ed75.koyeb.app https://*.koyeb.app",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "form-action 'self'",
].join("; ");

function cspHeaderPlugin() {
  return {
    name: "dev-csp-header",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader("Content-Security-Policy", DEV_CSP);
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader(
          "Permissions-Policy",
          "geolocation=(), microphone=(), camera=(), accelerometer=(), gyroscope=(), payment=()"
        );
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
        next();
      });
    },
  };
}

const defineMonacoWorkers = () => ({
  name: "monaco-local-workers",
  configureServer() {
    // No hace falta nada aquí, solo evita que busque en CDN
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    defineMonacoWorkers(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "typescript", "json"],
    }),
    ...(mode === "production" ? [] : []),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://unexpected-janine-uvg-9d84ed75.koyeb.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
}));
