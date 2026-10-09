import { applyCors, requireToken, rateLimit } from '../_lib/security.js';

/** Parse a required finite number within [min, max]; returns null when invalid (no silent coercion). */
const parseBoundedNumber = (value, min, max) => {
  if (value === undefined || value === null || value === '') return null;
  const n = typeof value === 'number' ? value : (typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
};

const MAX_REACTION_SAMPLES = 100;

export default function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (!requireToken(req, res)) return;

  if (req.method === 'GET') {
    res.status(200).json({
      service: "Prizm Driver Fatigue Handshake Engine",
      endpoint: "/api/v1/fatigue-score",
      status: "OPERATIONAL",
      version: "v3.0.0",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    if (!rateLimit(req, res, { limit: 60, windowMs: 60 * 1000 })) return;
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      
      const driverId = typeof body.driverId === 'string' && body.driverId.length <= 64 ? body.driverId : 'DRV-UNKNOWN';

      const drivingHours = parseBoundedNumber(body.drivingHours, 0, 24);
      if (drivingHours === null) {
        res.status(400).json({ success: false, error: 'drivingHours must be a number between 0 and 24' });
        return;
      }

      let reactionDropPct = 0;
      if (body.reactionDropPct !== undefined) {
        const parsedDrop = parseBoundedNumber(body.reactionDropPct, 0, 100);
        if (parsedDrop === null) {
          res.status(400).json({ success: false, error: 'reactionDropPct must be a number between 0 and 100' });
          return;
        }
        reactionDropPct = parsedDrop;
      }

      if (body.reactionTimes !== undefined && !Array.isArray(body.reactionTimes)) {
        res.status(400).json({ success: false, error: 'reactionTimes must be an array of milliseconds' });
        return;
      }
      const rawReactionTimes = Array.isArray(body.reactionTimes) ? body.reactionTimes : [];
      if (rawReactionTimes.length > MAX_REACTION_SAMPLES) {
        res.status(400).json({ success: false, error: `reactionTimes may contain at most ${MAX_REACTION_SAMPLES} samples` });
        return;
      }
      for (const t of rawReactionTimes) {
        if (typeof t !== 'number' || !Number.isFinite(t) || t <= 0) {
          res.status(400).json({ success: false, error: 'reactionTimes must contain only finite positive numbers' });
          return;
        }
      }
      const shiftType = typeof body.shiftType === 'string' && body.shiftType.length <= 64 ? body.shiftType : 'long-distance-driver';

      // Accurately compute reaction drop % for odd or even length arrays
      if (rawReactionTimes.length >= 2) {
        const mid = Math.floor(rawReactionTimes.length / 2);
        const baselineSlice = rawReactionTimes.slice(0, mid);
        const recentSlice = rawReactionTimes.slice(mid);
        
        const baselineSum = baselineSlice.reduce((a, b) => a + b, 0);
        const recentSum = recentSlice.reduce((a, b) => a + b, 0);

        const baseline = baselineSlice.length > 0 ? (baselineSum / baselineSlice.length) : 0;
        const recent = recentSlice.length > 0 ? (recentSum / recentSlice.length) : 0;

        if (baseline > 0) {
          reactionDropPct = Math.max(0, Math.round(((recent - baseline) / baseline) * 100));
        }
      }

      // Calculate Prizm Driver Fatigue Score (0 - 100)
      let hourPenalty = 0;
      if (drivingHours > 8) hourPenalty = 60;
      else if (drivingHours > 6) hourPenalty = 45;
      else if (drivingHours > 4) hourPenalty = 30;
      else if (drivingHours > 2) hourPenalty = 15;

      let reactionPenalty = 0;
      if (reactionDropPct > 35) reactionPenalty = 35;
      else if (reactionDropPct > 20) reactionPenalty = 25;
      else if (reactionDropPct > 10) reactionPenalty = 15;

      const totalFatigueScore = Math.min(100, Math.round(hourPenalty + reactionPenalty));

      let riskLevel = 'NOMINAL';
      let prizmAlertTriggered = false;
      let recommendedAction = 'Nominal driving state. Maintain standard rest stops every 2 hours.';
      let ohsComplianceAdvisory = 'Telemetry within the configured fatigue thresholds.';

      if (totalFatigueScore >= 70 || drivingHours >= 7.5 || reactionDropPct >= 35) {
        riskLevel = 'CRITICAL';
        prizmAlertTriggered = true;
        recommendedAction = 'PRIZM CRITICAL ALERT: Immediate pull-over mandatory! Micro-sleep probability elevated. 30-minute power rest required.';
        ohsComplianceAdvisory = 'OHS ACT SECTION 8 RISK: Continuous driving hours and cognitive latency exceed safe operational limits. Rest break required.';
      } else if (totalFatigueScore >= 40 || drivingHours >= 4 || reactionDropPct >= 15) {
        riskLevel = 'WARNING';
        prizmAlertTriggered = true;
        recommendedAction = 'PRIZM WARNING: Fatigue accumulation detected. Schedule rest break at next service station within 15 minutes.';
        ohsComplianceAdvisory = 'Fatigue advisory: cognitive load elevated. Take a preventative rest break before continuing (see voluntary ISO 45003 guidance).';
      }

      res.status(200).json({
        success: true,
        driverId,
        shiftType,
        fatigueScore: totalFatigueScore,
        riskLevel,
        drivingHours,
        reactionDropPct,
        prizmAlertTriggered,
        recommendedAction,
        ohsComplianceAdvisory,
        handshakeStatus: 'PRIZM_ACKNOWLEDGED',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: 'Invalid request payload',
        details: err.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
