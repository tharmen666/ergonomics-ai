import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { generateStatutoryDocument } from './src/api/compliance';
import { validateUserInput } from './src/lib/guardrails';
import { logStatutoryEvent } from './src/lib/auditLogger';

// Real build identifier for the Navbar badge: Vercel's commit SHA, else local git, else "local".
const resolveBuildId = (): string => {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromEnv) return fromEnv.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || 'local';
  } catch {
    return 'local';
  }
};

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/compliance') {
          // Check Bearer auth
          const authHeader = req.headers['authorization'] || req.headers['Authorization'];
          const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
            ? authHeader.slice(7).trim()
            : null;
          const expectedToken = process.env.ERGOSAFE_API_TOKEN || 'ergosafe-dev-token';

          if (!token || token !== expectedToken) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized: missing or invalid Bearer token' }));
            return;
          }

          if (req.method === 'GET') {
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

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const payload = body ? JSON.parse(body) : {};
                const VALID_TASK_TYPES = ['HIRA', 'SWP', 'Incident Root Cause', 'Toolbox Talk'];

                if (!payload.taskType || !VALID_TASK_TYPES.includes(payload.taskType)) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: `Bad Request: taskType must be one of [${VALID_TASK_TYPES.join(', ')}]`
                  }));
                  return;
                }

                if (payload.siteContext && typeof payload.siteContext === 'string' && payload.siteContext.length > 200) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: 'Bad Request: siteContext exceeds maximum allowed length of 200 characters'
                  }));
                  return;
                }

                if (payload.hazards && typeof payload.hazards === 'string' && payload.hazards.length > 2000) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: 'Bad Request: hazards exceeds maximum allowed length of 2000 characters'
                  }));
                  return;
                }

                const result = await generateStatutoryDocument(payload);
                if (!result.success && result.error && result.error.includes('Service Unavailable')) {
                  res.statusCode = 503;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Service Unavailable: upstream AI compliance model is currently unavailable' }));
                  return;
                }
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
        }

        if (req.url === '/api/manual-handling') {
          const authHeader = req.headers['authorization'] || req.headers['Authorization'];
          const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
            ? authHeader.slice(7).trim()
            : null;
          const expectedToken = process.env.ERGOSAFE_API_TOKEN || 'ergosafe-dev-token';

          if (!token || token !== expectedToken) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized: missing or invalid Bearer token' }));
            return;
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              service: 'ErgoSafe Statutory Manual Handling Calculation Engine',
              endpoint: '/api/manual-handling',
              status: 'OPERATIONAL',
              version: 'v3.0.0',
              statutoryFramework: 'OHS Act 85 of 1993 & Ergonomics Regulations 2019 (GN R1589)',
              timestamp: new Date().toISOString()
            }));
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const payload = body ? JSON.parse(body) : {};
                const { userId, role, taskDescription, manualHandlingMetrics } = payload;
                const ip = (req.socket && req.socket.remoteAddress) || '127.0.0.1';

                if (!manualHandlingMetrics || typeof manualHandlingMetrics !== 'object') {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Bad Request: manualHandlingMetrics object is required' }));
                  return;
                }

                const loadWeightKg = Number(manualHandlingMetrics.loadWeightKg);
                const frequencyPerHour = Number(manualHandlingMetrics.frequencyPerHour);

                if (!Number.isFinite(loadWeightKg) || loadWeightKg < 0 || !Number.isFinite(frequencyPerHour) || frequencyPerHour < 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Bad Request: loadWeightKg and frequencyPerHour must be non-negative numbers' }));
                  return;
                }

                const validation = validateUserInput(taskDescription);
                if (!validation.isValid) {
                  await logStatutoryEvent({
                    userId: userId || 'anonymous',
                    userRole: role || 'unverified',
                    action: 'SECURITY_VIOLATION',
                    systemModule: 'ERGOSAFE',
                    promptInput: typeof taskDescription === 'string' ? taskDescription : String(taskDescription ?? ''),
                    statutoryOutcome: `BLOCKED: ${validation.violationCode}`,
                    ipAddress: ip
                  });
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: validation.reason, code: validation.violationCode }));
                  return;
                }

                const calculatedRisk = Number(((loadWeightKg * frequencyPerHour) / 100).toFixed(2));
                const isOver25Kg = loadWeightKg > 25;
                const isHighRisk = calculatedRisk > 2.0 || isOver25Kg;
                const statutoryOutcome = isHighRisk ? 'HIGH_RISK_MANDATORY_INTERVENTION' : 'COMPLIANT';
                const statutoryLevel = isHighRisk ? 'Priority Level 1' : 'Routine Maintenance';

                const auditRecord = await logStatutoryEvent({
                  userId: userId || 'anonymous',
                  userRole: role || 'unverified',
                  action: 'AUDIT_RUN',
                  systemModule: 'ERGOSAFE',
                  promptInput: validation.sanitizedInput,
                  calculatedRiskScore: calculatedRisk,
                  statutoryOutcome,
                  ipAddress: ip
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  status: 'success',
                  riskScore: calculatedRisk,
                  statutoryLevel,
                  statutoryOutcome,
                  requiresOMPReferral: isHighRisk,
                  statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894)',
                  auditLogId: auditRecord.id,
                  timestamp: new Date().toISOString()
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [react(), apiDevMiddleware()],
  define: {
    __APP_BUILD__: JSON.stringify(resolveBuildId())
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Only pin the libraries every page needs. three / @react-three are left to Rollup so they
        // land in a lazy chunk loaded with the 3D pages. (The old object form pulled React's
        // `scheduler` and Vite's preload helper into vendor-three, so the 958 kB 3D bundle was
        // preloaded on first paint.)
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|zustand|use-sync-external-store)[\\/]/.test(id)) return 'vendor-core';
          if (/[\\/]node_modules[\\/](lucide-react|framer-motion)[\\/]/.test(id)) return 'vendor-ui';
          return undefined;
        }
      }
    }
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true
  }
});
