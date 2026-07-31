export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      service: "Shandray's Prizm Alert Handshake Engine",
      endpoint: "/api/v1/fatigue-score",
      status: "OPERATIONAL",
      version: "v3.0.0",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      
      const driverId = body.driverId || 'DRV-7749';
      const drivingHours = parseFloat(body.drivingHours) || 0;
      const reactionTimes = Array.isArray(body.reactionTimes) ? body.reactionTimes : [];
      let reactionDropPct = parseFloat(body.reactionDropPct) || 0;
      const shiftType = body.shiftType || 'long-distance-driver';

      // Compute reaction drop % if reactionTimes array is passed
      if (reactionTimes.length >= 2) {
        const baseline = reactionTimes.slice(0, Math.ceil(reactionTimes.length / 2)).reduce((a, b) => a + b, 0) / (reactionTimes.length / 2);
        const recent = reactionTimes.slice(Math.ceil(reactionTimes.length / 2)).reduce((a, b) => a + b, 0) / (reactionTimes.length / 2);
        if (baseline > 0) {
          reactionDropPct = Math.max(0, Math.round(((recent - baseline) / baseline) * 100));
        }
      }

      // Calculate Shandray's Prizm Driver Fatigue Score (0 - 100)
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
      let ohsComplianceAdvisory = 'ISO 45001: Safe driving telemetry within legal thresholds.';

      if (totalFatigueScore >= 70 || drivingHours >= 7.5 || reactionDropPct >= 35) {
        riskLevel = 'CRITICAL_BREACH';
        prizmAlertTriggered = true;
        recommendedAction = 'PRIZM CRITICAL ALERT: Immediate pull-over mandatory! Micro-sleep probability >78%. 30-minute power rest required.';
        ohsComplianceAdvisory = 'SECTION 37 OHS ACT BREACH: Continuous driving hours and cognitive latency exceed safety limits. Vehicle lockout handshake dispatched.';
      } else if (totalFatigueScore >= 40 || drivingHours >= 4 || reactionDropPct >= 15) {
        riskLevel = 'WARNING';
        prizmAlertTriggered = true;
        recommendedAction = 'PRIZM WARNING: Fatigue accumulation detected. Schedule rest break at next service station within 15 minutes.';
        ohsComplianceAdvisory = 'ISO 45003 Advisory: Cognitive load elevated. Preventative rest break required before continuing route.';
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
        handshakeStatus: 'SHANDRAY_PRIZM_ACKNOWLEDGED',
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
