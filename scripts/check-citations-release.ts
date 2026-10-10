import { runCitationCheck } from './check-citations';

process.env.REQUIRE_VERIFIED_CITATIONS = '1';
try {
  runCitationCheck(true);
} catch (err: any) {
  console.error(err.message || err);
  process.exit(1);
}
