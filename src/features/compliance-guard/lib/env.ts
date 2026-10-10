import { z } from 'zod';

const secretString = (varName: string) =>
  z.string()
  .min(32, `Environment variable ${varName} must be at least 32 characters long`);

const EnvSchema = z.object({
  // Required cryptographic secrets (min 32 characters, no fallback)
  DOC_SEAL_SECRET: secretString('DOC_SEAL_SECRET'),
  DOWNLOAD_TOKEN_SECRET: secretString('DOWNLOAD_TOKEN_SECRET'),

  // Application Base URL
  APP_URL: z.string().url('Environment variable APP_URL must be a valid URL'),

  // PayFast credentials
  PAYFAST_MERCHANT_ID: z.string().min(1, 'Environment variable PAYFAST_MERCHANT_ID cannot be empty'),
  PAYFAST_MERCHANT_KEY: z.string().min(1, 'Environment variable PAYFAST_MERCHANT_KEY cannot be empty'),
  PAYFAST_PASSPHRASE: secretString('PAYFAST_PASSPHRASE'),

  // Supplier / Business Details (used exclusively for invoices & statutory files; no hard-coded personal attribution)
  SUPPLIER_LEGAL_NAME: z.string().min(1, 'Environment variable SUPPLIER_LEGAL_NAME cannot be empty'),
  SUPPLIER_ADDRESS: z.string().min(1, 'Environment variable SUPPLIER_ADDRESS cannot be empty'),
  SUPPLIER_EMAIL: z.string().email('Environment variable SUPPLIER_EMAIL must be a valid email'),
  SUPPLIER_PHONE: z.string().min(5, 'Environment variable SUPPLIER_PHONE cannot be empty'),

  // Optional variables
  SUPPLIER_VAT_NUMBER: z.string().optional(),
  PAYFAST_SANDBOX: z.enum(['true', 'false', '1', '0']).optional().default('false'),
  REQUIRE_VERIFIED_CITATIONS: z.enum(['1', '0', 'true', 'false']).optional().default('0'),
  PRICE_INCLUDES_VAT: z.enum(['true', 'false', '1', '0']).optional().default('true'),
  MAX_DOWNLOAD_USES: z.coerce.number().int().min(1).max(10).optional().default(3),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),
});

export type ValidatedEnv = z.infer<typeof EnvSchema>;

let cachedEnv: ValidatedEnv | undefined;

/**
 * Validates environment variables from process.env or an explicit source object.
 * Missing or short secret values throw a clear error naming the variable without printing its value.
 */
export function getEnv(source: Record<string, string | undefined> = process.env): ValidatedEnv {
  if (source === process.env && cachedEnv) {
    return cachedEnv;
  }

  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const issue = result.error.issues[0];
    const path = issue.path.join('.');
    // Secure error message: names the variable, never leaks any secret values
    throw new Error(`Environment Configuration Error [${path}]: ${issue.message}`);
  }

  if (source === process.env) {
    cachedEnv = result.data;
  }
  return result.data;
}

export function resetCachedEnv(): void {
  cachedEnv = undefined;
}
