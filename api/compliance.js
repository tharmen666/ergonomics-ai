import { generateStatutoryDocument } from '../src/api/compliance.js';
import { randomUUID } from 'node:crypto';
import { applyCors, requireToken, rateLimit } from './_lib/security.js';

const newRequestId = () => `req-${randomUUID()}`;

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
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
      res.status(400).json({ error: 'Bad Request: body must be valid JSON' });
      return;
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'Bad Request: body must be a JSON object' });
      return;
    }
    const requestId = newRequestId();
    try {
      const { taskType, siteContext, hazards } = body;

      // Input validation
      if (!taskType || !VALID_TASK_TYPES.includes(taskType)) {
        res.status(400).json({
          error: `Bad Request: taskType must be one of [${VALID_TASK_TYPES.join(', ')}]`
        });
        return;
      }

      if (siteContext !== undefined && siteContext !== null && typeof siteContext !== 'string') {
        res.status(400).json({ error: 'Bad Request: siteContext must be a string' });
        return;
      }
      if (hazards !== undefined && hazards !== null && typeof hazards !== 'string') {
        res.status(400).json({ error: 'Bad Request: hazards must be a string' });
        return;
      }

      if (siteContext && siteContext.length > 200) {
        res.status(400).json({
          error: 'Bad Request: siteContext exceeds maximum allowed length of 200 characters'
        });
        return;
      }

      if (hazards && hazards.length > 2000) {
        res.status(400).json({
          error: 'Bad Request: hazards exceeds maximum allowed length of 2000 characters'
        });
        return;
      }

      // Only the validated fields reach the generator - never the raw body.
      const result = await generateStatutoryDocument({
        taskType,
        siteContext: siteContext || undefined,
        hazards: hazards || undefined
      });
      if (!result.success && result.error && result.error.includes('Service Unavailable')) {
        console.error(`[API /api/compliance] ${requestId} upstream unavailable:`, result.error);
        res.status(503).json({
          success: false,
          error: 'Service Unavailable: upstream AI compliance model is currently unavailable',
          requestId
        });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      // Details stay in the server log; the client only gets a reference it can quote.
      console.error(`[API /api/compliance] ${requestId} error processing request:`, err);
      res.status(500).json({
        success: false,
        error: 'Failed to generate compliance document',
        requestId
      });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
