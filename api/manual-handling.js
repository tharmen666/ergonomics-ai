import { applyCors, requireToken, rateLimit, clientIp } from './_lib/security.js';
import { validateUserInput } from '../src/lib/guardrails.js';
import { logStatutoryEvent } from '../src/lib/auditLogger.js';

/**
 * Validates a number as finite and non-negative within allowable boundaries.
 */
function parseNonNegativeNumber(value, max = 1000) {
  if (value === undefined || value === null || value === '') return null;
  const n = typeof value === 'number' ? value : (typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Fails closed if ERGOSAFE_API_TOKEN is not set or token does not match
  if (!requireToken(req, res)) return;

  if (req.method === 'GET') {
    res.status(200).json({
      service: 'ErgoSafe Statutory Manual Handling Calculation Engine',
      endpoint: '/api/manual-handling',
      status: 'OPERATIONAL',
      version: 'v3.0.0',
      statutoryFramework: 'OHS Act 85 of 1993 & Ergonomics Regulations 2019 (GN R1589)',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    if (!rateLimit(req, res, { limit: 60, windowMs: 60 * 1000 })) return;

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

    const { userId, role, taskDescription, manualHandlingMetrics } = body;
    const ip = clientIp(req);

    // Validate manual handling metrics existence and shape
    if (!manualHandlingMetrics || typeof manualHandlingMetrics !== 'object') {
      res.status(400).json({
        error: 'Bad Request: manualHandlingMetrics object is required'
      });
      return;
    }

    const loadWeightKg = parseNonNegativeNumber(manualHandlingMetrics.loadWeightKg, 500);
    const frequencyPerHour = parseNonNegativeNumber(manualHandlingMetrics.frequencyPerHour, 1000);

    if (loadWeightKg === null || frequencyPerHour === null) {
      res.status(400).json({
        error: 'Bad Request: loadWeightKg (0-500) and frequencyPerHour (0-1000) must be non-negative numbers'
      });
      return;
    }

    // STEP 1: Guardrail Validation (Input Defense)
    const validation = validateUserInput(taskDescription);
    if (!validation.isValid) {
      // Mandatory Immutable Log of the Tamper/Violation Attempt
      await logStatutoryEvent({
        userId: typeof userId === 'string' && userId ? userId : 'anonymous',
        userRole: typeof role === 'string' && role ? role : 'unverified',
        action: 'SECURITY_VIOLATION',
        systemModule: 'ERGOSAFE',
        promptInput: typeof taskDescription === 'string' ? taskDescription : String(taskDescription ?? ''),
        statutoryOutcome: `BLOCKED: ${validation.violationCode}`,
        ipAddress: ip,
        details: {
          violationReason: validation.reason,
          loadWeightKg,
          frequencyPerHour
        }
      });

      res.status(403).json({
        error: validation.reason,
        code: validation.violationCode
      });
      return;
    }

    // STEP 2: Pure Engine Calculation (No User Override)
    // Strain score calculation based on load weight and hourly lift frequency
    const calculatedRisk = Number(((loadWeightKg * frequencyPerHour) / 100).toFixed(2));

    // South African OHS statutory trigger:
    // Ergonomics Regulations 2019 classifies manual lifting exceeding 25 kg as high-risk,
    // requiring mandatory Regulation 6 risk assessment and Regulation 8(1) OMP referral.
    const isOver25Kg = loadWeightKg > 25;
    const isHighRisk = calculatedRisk > 2.0 || isOver25Kg;
    const statutoryOutcome = isHighRisk ? 'HIGH_RISK_MANDATORY_INTERVENTION' : 'COMPLIANT';
    const statutoryLevel = isHighRisk ? 'Priority Level 1' : 'Routine Maintenance';

    // STEP 3: Mandatory Immutable Audit Logging
    const auditRecord = await logStatutoryEvent({
      userId: typeof userId === 'string' && userId ? userId : 'anonymous',
      userRole: typeof role === 'string' && role ? role : 'unverified',
      action: 'AUDIT_RUN',
      systemModule: 'ERGOSAFE',
      promptInput: validation.sanitizedInput,
      calculatedRiskScore: calculatedRisk,
      statutoryOutcome,
      ipAddress: ip,
      details: {
        loadWeightKg,
        frequencyPerHour,
        isOverStatutoryGuidance: isOver25Kg,
        requiresOMPReferral: isHighRisk
      }
    });

    // STEP 4: Return Verified Statutory Output
    res.status(200).json({
      status: 'success',
      riskScore: calculatedRisk,
      statutoryLevel,
      statutoryOutcome,
      requiresOMPReferral: isHighRisk,
      statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894)',
      auditLogId: auditRecord.id,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
