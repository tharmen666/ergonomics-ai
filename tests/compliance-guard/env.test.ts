import { describe, it, expect } from 'vitest';
import { getEnv } from '@/lib/env';

describe('Phase 1: Environment Configuration & Strict Secrets Validation', () => {
  const validBase = {
    DOC_SEAL_SECRET: 'a'.repeat(32),
    DOWNLOAD_TOKEN_SECRET: 'b'.repeat(32),
    APP_URL: 'https://complianceguard.co.za',
    PAYFAST_MERCHANT_ID: '10000100',
    PAYFAST_MERCHANT_KEY: '46f0cd694581a',
    PAYFAST_PASSPHRASE: 'c'.repeat(32),
    SUPPLIER_LEGAL_NAME: 'ComplianceGuard AI Pty Ltd',
    SUPPLIER_ADDRESS: '123 Main Road, Johannesburg',
    SUPPLIER_EMAIL: 'ops@complianceguard.co.za',
    SUPPLIER_PHONE: '+27 11 123 4567',
  };

  it('passes when all required variables and 32+ char secrets are provided', () => {
    const env = getEnv(validBase);
    expect(env.DOC_SEAL_SECRET).toBe('a'.repeat(32));
    expect(env.DOWNLOAD_TOKEN_SECRET).toBe('b'.repeat(32));
    expect(env.APP_URL).toBe('https://complianceguard.co.za');
  });

  it('throws clear error naming the variable when a secret is missing', () => {
    const invalid = { ...validBase };
    delete (invalid as any).DOC_SEAL_SECRET;

    expect(() => getEnv(invalid)).toThrow(/DOC_SEAL_SECRET/);
  });

  it('throws clear error when a secret is 31 characters long (under 32 minimum)', () => {
    const invalid = {
      ...validBase,
      DOC_SEAL_SECRET: 'x'.repeat(31), // 31 chars
    };

    expect(() => getEnv(invalid)).toThrow(/DOC_SEAL_SECRET/);
    expect(() => getEnv(invalid)).toThrow(/32 characters/);
  });

  it('throws clear error naming the variable when DOWNLOAD_TOKEN_SECRET is missing', () => {
    const invalid = { ...validBase };
    delete (invalid as any).DOWNLOAD_TOKEN_SECRET;

    expect(() => getEnv(invalid)).toThrow(/DOWNLOAD_TOKEN_SECRET/);
  });

  it('throws clear error when APP_URL is not a valid URL', () => {
    const invalid = {
      ...validBase,
      APP_URL: 'not-a-valid-url',
    };

    expect(() => getEnv(invalid)).toThrow(/APP_URL/);
  });
});
