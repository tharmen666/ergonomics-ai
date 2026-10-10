import jwt from 'jsonwebtoken';
import { db } from '../src/lib/db/repo';

const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'download-secret-32-chars-min';

async function testDownloadRoute() {
  console.log('🧪 Starting Secure Download Route & Token Verification Tests...\n');

  const docId = 'doc_wimpy_southgate_001';

  // 1. Missing token test
  console.log('Test 1: Missing Token Verification');
  const reqNoToken = new Request(`http://localhost:3000/api/downloads/${docId}`);
  const { GET } = await import('../src/app/api/downloads/[docId]/route');
  
  const resNoToken = await GET(reqNoToken, { params: Promise.resolve({ docId }) });
  const dataNoToken = await resNoToken.json();
  console.log(`- Status: ${resNoToken.status}, Response:`, dataNoToken);
  if (resNoToken.status !== 403 || !dataNoToken.error.includes('Missing Download Token')) {
    throw new Error('Test 1 Failed: Expected 403 Missing Token');
  }
  console.log('✅ Test 1 Passed\n');

  // 2. Invalid signature token
  console.log('Test 2: Invalid/Forged Token Verification');
  const forgedToken = jwt.sign({ docId }, 'wrong-secret');
  const reqForged = new Request(`http://localhost:3000/api/downloads/${docId}?token=${forgedToken}`);
  const resForged = await GET(reqForged, { params: Promise.resolve({ docId }) });
  const dataForged = await resForged.json();
  console.log(`- Status: ${resForged.status}, Response:`, dataForged);
  if (resForged.status !== 403 || !dataForged.error.includes('Expired or Invalid Token')) {
    throw new Error('Test 2 Failed: Expected 403 Invalid Token');
  }
  console.log('✅ Test 2 Passed\n');

  // 3. Mismatched docId token
  console.log('Test 3: Mismatched DocId Payload Verification');
  const wrongDocToken = jwt.sign({ docId: 'doc_other_franchise_999' }, TOKEN_SECRET);
  const reqMismatched = new Request(`http://localhost:3000/api/downloads/${docId}?token=${wrongDocToken}`);
  const resMismatched = await GET(reqMismatched, { params: Promise.resolve({ docId }) });
  const dataMismatched = await resMismatched.json();
  console.log(`- Status: ${resMismatched.status}, Response:`, dataMismatched);
  if (resMismatched.status !== 403 || !dataMismatched.error.includes('Invalid Token Payload')) {
    throw new Error('Test 3 Failed: Expected 403 Invalid Token Payload');
  }
  console.log('✅ Test 3 Passed\n');

  // 4. Valid Token & Authorized Download Test (uses 1 to 5)
  console.log('Test 4: Valid Token & Streaming PDF Verification');
  const validToken = jwt.sign({ docId }, TOKEN_SECRET, { expiresIn: '1h' });

  for (let i = 1; i <= 5; i++) {
    const reqValid = new Request(`http://localhost:3000/api/downloads/${docId}?token=${validToken}`);
    const resValid = await GET(reqValid, { params: Promise.resolve({ docId }) });
    console.log(`- Attempt ${i}: Status: ${resValid.status}, Content-Type: ${resValid.headers.get('content-type')}`);
    
    if (resValid.status !== 200 || resValid.headers.get('content-type') !== 'application/pdf') {
      throw new Error(`Test 4 Failed at attempt ${i}: Expected 200 PDF Stream`);
    }
  }
  console.log('✅ Test 4 Passed: 5 authorized downloads completed successfully\n');

  // 5. 6th Attempt: Atomic use-count limit exceeded
  console.log('Test 5: Download Limit Exceeded (Attempt 6)');
  const reqExceeded = new Request(`http://localhost:3000/api/downloads/${docId}?token=${validToken}`);
  const resExceeded = await GET(reqExceeded, { params: Promise.resolve({ docId }) });
  const dataExceeded = await resExceeded.json();
  console.log(`- Attempt 6: Status: ${resExceeded.status}, Response:`, dataExceeded);
  if (resExceeded.status !== 403 || !dataExceeded.error.includes('Download limit exceeded')) {
    throw new Error('Test 5 Failed: Expected 403 Download limit exceeded');
  }
  console.log('✅ Test 5 Passed: Atomic usage limit (>5) properly enforced\n');

  console.log('🎉 ALL SECURE DOWNLOAD ROUTE TESTS PASSED SUCCESSFULLY!');
}

testDownloadRoute().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
