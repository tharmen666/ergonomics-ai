// TODO: not implemented - returns 501 rather than pretending to sync.
import { applyCors, requireToken } from './_lib/security.js';

export default function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (!requireToken(req, res)) return;

  if (req.method === 'POST') {
    res.status(501).json({
      success: false,
      error: 'Not Implemented: Telemetry sync endpoint is not yet implemented'
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
