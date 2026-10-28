import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_TARGET = process.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy backend microservice endpoints through API Gateway (port 8080)
      '^/(auth|users|students|jobs|drives|applications|companies|notifications|reports|actuator)': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            const errorMsg = `[Vite Proxy Error] ${req.method} ${req.url} -> Backend offline or connection failed (${err.message}). Is API Gateway running on ${BACKEND_TARGET}?`;
            console.error(errorMsg);

            // Respond with HTTP 502 JSON so the failure reason is visible in Chrome DevTools Network tab
            if (res && !res.headersSent && typeof (res as any).writeHead === 'function') {
              (res as any).writeHead(502, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              (res as any).end(
                JSON.stringify({
                  status: 502,
                  error: 'Bad Gateway',
                  message: errorMsg,
                  detail: err.message,
                  method: req.method,
                  url: req.url,
                  target: BACKEND_TARGET,
                  timestamp: new Date().toISOString(),
                })
              );
            }
          });

          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log(`[Vite Proxy -> Backend] ${req.method} ${req.url} -> ${BACKEND_TARGET}${req.url}`);
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            const status = proxyRes.statusCode || 0;
            const logFn = status >= 400 ? console.warn : console.log;
            logFn(`[Vite Proxy <- Backend] ${req.method} ${req.url} -> Status: ${status}`);
          });
        },
      },
      // Proxy any explicit /api prefixed requests with rewrite
      '/api': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            const errorMsg = `[Vite Proxy Error] ${req.method} ${req.url} -> Backend connection failed (${err.message})`;
            console.error(errorMsg);
            if (res && !res.headersSent && typeof (res as any).writeHead === 'function') {
              (res as any).writeHead(502, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              (res as any).end(
                JSON.stringify({
                  status: 502,
                  error: 'Bad Gateway',
                  message: errorMsg,
                  detail: err.message,
                  method: req.method,
                  url: req.url,
                  target: BACKEND_TARGET,
                  timestamp: new Date().toISOString(),
                })
              );
            }
          });
        },
      },
    },
  },
});
