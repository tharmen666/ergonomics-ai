import { generateStatutoryDocument } from '../src/api/compliance.js';
import { applyCors, requireToken, rateLimit } from './_lib/security.js';

const VALID_TASK_TYPES = ['HIRA', 'SWP', 'Incident Root Cause', 'Toolbox Talk'];

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Fails closed when ERGOSAFE_API_TOKEN is unset (no default token). See api/_lib/security.js.
  if (!requireToken(req, res)) return;

  if (req.method === 'GET') {
    res.status(200).json({
      service: 'ErgoSafe Statutory OHS Compliance Engine',
      endpoint: '/api/compliance',
      status: 'OPERATIONAL',
      framework: 'South African OHS Act 85 of 1993 & Ergonomics Regs 2019',
      version: 'v3.0.0',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    // Each POST calls the paid AI model: cap it per client IP (10 per 10 minutes)
    if (!rateLimit(req, res, { limit: 10, windowMs: 10 * 60 * 1000 })) return;
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { taskType, siteContext, hazards } = body;

      // Input validation
      if (!taskType || !VALID_TASK_TYPES.includes(taskType)) {
        res.status(400).json({
          error: `Bad Request: taskType must be one of [${VALID_TASK_TYPES.join(', ')}]`
        });
        return;
      }

      if (siteContext && typeof siteContext === 'string' && siteContext.length > 200) {
        res.status(400).json({
          error: 'Bad Request: siteContext exceeds maximum allowed length of 200 characters'
        });
        return;
      }

      if (hazards && typeof hazards === 'string' && hazards.length > 2000) {
        res.status(400).json({
          error: 'Bad Request: hazards exceeds maximum allowed length of 2000 characters'
        });
        return;
      }

      const result = await generateStatutoryDocument(body);
      if (!result.success && result.error && result.error.includes('Service Unavailable')) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable: upstream AI compliance model is currently unavailable',
          details: result.error
        });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.error('[API /api/compliance] Error processing request:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to generate statutory compliance document',
        details: err.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
