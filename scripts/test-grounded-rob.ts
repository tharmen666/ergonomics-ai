import { queryGroundedRob } from '../src/lib/compliance/grounded-rob';

function testGroundedRob() {
  console.log('🧪 Testing Grounded Rob Regulatory Q&A Engine...\n');

  // Test 1: S17 H&S Representatives
  console.log('Test 1: S17 Query');
  const res1 = queryGroundedRob("What are the rules for Health and Safety Representatives?");
  console.log('Response:', res1);
  if (!res1.citationsUsed.includes('OHSA_S17') || !res1.answer.includes('OHSA_S17')) {
    throw new Error('Test 1 Failed: Expected OHSA_S17 citation');
  }
  console.log('✅ Test 1 Passed\n');

  // Test 2: GSR 3 First Aid
  console.log('Test 2: GSR 3 First Aid Query');
  const res2 = queryGroundedRob("What does First Aid regulation require?");
  console.log('Response:', res2);
  if (!res2.citationsUsed.includes('GSR_3') || !res2.answer.includes('GSR_3')) {
    throw new Error('Test 2 Failed: Expected GSR_3 citation');
  }
  console.log('✅ Test 2 Passed\n');

  // Test 3: Unmatched query fallback
  console.log('Test 3: Unmatched legal query fallback');
  const res3 = queryGroundedRob("What is the penalty for copyright infringement under international maritime trade?");
  console.log('Response:', res3);
  if (res3.answer !== "This requires human professional legal interpretation." || res3.citationsUsed.length !== 0) {
    throw new Error('Test 3 Failed: Expected fallback string and empty citations');
  }
  console.log('✅ Test 3 Passed\n');

  console.log('🎉 ALL GROUNDED ROB TESTS PASSED SUCCESSFULLY!');
}

testGroundedRob();
