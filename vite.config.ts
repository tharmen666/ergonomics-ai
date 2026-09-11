import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { generateStatutoryDocument } from './src/api/compliance';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/compliance' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = body ? JSON.parse(body) : {};
              const result = await generateStatutoryDocument(payload);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/compliance' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            service: 'ErgoSafe Statutory OHS Compliance Engine',
            endpoint: '/api/compliance',
            status: 'OPERATIONAL',
            framework: 'South African OHS Act 85 of 1993 & Ergonomics Regs 2019',
            version: 'v3.0.0',
            timestamp: new Date().toISOString()
          }));
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), apiDevMiddleware()],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true
  }
});
