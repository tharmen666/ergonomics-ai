import { generateStatutoryDocument } from '../src/api/compliance.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const result = await generateStatutoryDocument(body);
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
