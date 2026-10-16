/**
 * ErgoSafe Reborn V3 - Manual Handling Risk Route Handler (Web Standard / Next.js compatible)
 * Implements the 4-step Statutory Guardrail and Audit workflow for Fetch/Next.js Request objects.
 */

import { validateUserInput } from './guardrails';
import { logStatutoryEvent } from './auditLogger';

export interface ManualHandlingRequestBody {
  userId?: string;
  role?: string;
  taskDescription: string;
  manualHandlingMetrics: {
    loadWeightKg: number;
    frequencyPerHour: number;
  };
}

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  let body: ManualHandlingRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Bad Request: body must be valid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { userId, role, taskDescription, manualHandlingMetrics } = body || {};

  if (!manualHandlingMetrics || typeof manualHandlingMetrics !== 'object') {
    return new Response(
      JSON.stringify({ error: 'Bad Request: manualHandlingMetrics object is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { loadWeightKg, frequencyPerHour } = manualHandlingMetrics;
  if (
    typeof loadWeightKg !== 'number' ||
    !Number.isFinite(loadWeightKg) ||
    loadWeightKg < 0 ||
    typeof frequencyPerHour !== 'number' ||
    !Number.isFinite(frequencyPerHour) ||
    frequencyPerHour < 0
  ) {
    return new Response(
      JSON.stringify({
        error: 'Bad Request: loadWeightKg and frequencyPerHour must be valid non-negative numbers'
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // STEP 1: Guardrail Validation (Input Defense)
  const validation = validateUserInput(taskDescription);
  if (!validation.isValid) {
    // Mandatory Log of the Tamper Attempt
    await logStatutoryEvent({
      userId: userId || 'anonymous',
      userRole: role || 'unverified',
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

    return new Response(
      JSON.stringify({ error: validation.reason, code: validation.violationCode }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // STEP 2: Pure Engine Calculation (No User Override)
  // Strain score calculation based on load weight and hourly lift frequency
  const calculatedRisk = Number(((loadWeightKg * frequencyPerHour) / 100).toFixed(2));
  const isOver25Kg = loadWeightKg > 25;
  const isHighRisk = calculatedRisk > 2.0 || isOver25Kg;
  const statutoryOutcome = isHighRisk ? 'HIGH_RISK_MANDATORY_INTERVENTION' : 'COMPLIANT';
  const statutoryLevel = isHighRisk ? 'Priority Level 1' : 'Routine Maintenance';

  // STEP 3: Mandatory Immutable Audit Logging
  const auditRecord = await logStatutoryEvent({
    userId: userId || 'anonymous',
    userRole: role || 'unverified',
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
  return new Response(
    JSON.stringify({
      status: 'success',
      riskScore: calculatedRisk,
      statutoryLevel,
      statutoryOutcome,
      requiresOMPReferral: isHighRisk,
      statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894)',
      auditLogId: auditRecord.id,
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
