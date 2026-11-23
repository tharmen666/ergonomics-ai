export const CAMERA_CONSENT_STORAGE_KEY = 'ergosafe_popia_s18_camera_consent';
export const STATUTORY_ASSESSMENTS_STORAGE_KEY = 'ergosafe_statutory_assessments_v1';

export interface CameraConsentRecord {
  accepted: boolean;
  mode: 'unset' | 'camera' | 'manual';
  updatedAt: string | null;
  version: string;
}

const DEFAULT_CONSENT: CameraConsentRecord = {
  accepted: false,
  mode: 'unset',
  updatedAt: null,
  version: 'POPIA-S18-v1',
};

export function getCameraConsentState(): CameraConsentRecord {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...DEFAULT_CONSENT };
  }
  try {
    const raw = window.localStorage.getItem(CAMERA_CONSENT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    const parsed = JSON.parse(raw) as Partial<CameraConsentRecord>;
    const mode = parsed.mode === 'camera' || parsed.mode === 'manual' ? parsed.mode : 'unset';
    return {
      accepted: mode === 'camera' && parsed.accepted === true,
      mode,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
      version: typeof parsed.version === 'string' ? parsed.version : 'POPIA-S18-v1',
    };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function setCameraConsentState(mode: 'camera' | 'manual'): CameraConsentRecord {
  const record: CameraConsentRecord = {
    accepted: mode === 'camera',
    mode,
    updatedAt: new Date().toISOString(),
    version: 'POPIA-S18-v1',
  };
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(CAMERA_CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage quota errors
    }
  }
  return record;
}

export function revokeCameraConsent(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(CAMERA_CONSENT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}

export interface StoredDataEntry {
  storage: 'localStorage' | 'sessionStorage';
  key: string;
  bytes: number;
  preview: string;
}

function measureUtf8Bytes(str: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  return str.length;
}

function sanitizePreview(val: string): string {
  const compact = val.replace(/\s+/g, ' ').trim();
  return compact.length > 80 ? `${compact.slice(0, 77)}...` : compact;
}

export function listLocalDataEntries(): StoredDataEntry[] {
  if (typeof window === 'undefined') return [];
  const entries: StoredDataEntry[] = [];
  const storages: Array<{ name: 'localStorage' | 'sessionStorage'; store: Storage | undefined }> = [
    { name: 'localStorage', store: window.localStorage },
    { name: 'sessionStorage', store: window.sessionStorage },
  ];

  for (const { name, store } of storages) {
    if (!store) continue;
    try {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (!key) continue;
        const value = store.getItem(key) ?? '';
        entries.push({
          storage: name,
          key,
          bytes: measureUtf8Bytes(value),
          preview: sanitizePreview(value),
        });
      }
    } catch {
      // Storage access restricted
    }
  }

  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

export function wipeAllLocalSessionData(options?: { preserveAuth?: boolean }): {
  clearedCount: number;
  clearedKeys: string[];
  wipedAt: string;
} {
  const wipedAt = new Date().toISOString();
  const clearedKeys: string[] = [];
  if (typeof window === 'undefined') {
    return { clearedCount: 0, clearedKeys, wipedAt };
  }

  const preserveAuth = options?.preserveAuth === true;
  const preservedAuthKey = 'tenant-billing-telemetry-storage';

  try {
    if (window.localStorage) {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k) keys.push(k);
      }
      for (const k of keys) {
        if (preserveAuth && k === preservedAuthKey) continue;
        window.localStorage.removeItem(k);
        clearedKeys.push(`localStorage:${k}`);
      }
    }
  } catch {
    // Ignore storage errors
  }

  try {
    if (window.sessionStorage) {
      const keys: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k) keys.push(k);
      }
      for (const k of keys) {
        window.sessionStorage.removeItem(k);
        clearedKeys.push(`sessionStorage:${k}`);
      }
    }
  } catch {
    // Ignore storage errors
  }

  try {
    window.dispatchEvent(new CustomEvent('ERGOSAFE_LOCAL_DATA_WIPED', { detail: { wipedAt, clearedKeys } }));
  } catch {
    // Ignore event dispatch issues
  }

  return {
    clearedCount: clearedKeys.length,
    clearedKeys,
    wipedAt,
  };
}

export async function sha256Hex(payload: string): Promise<string> {
  const subtle = typeof globalThis !== 'undefined' ? globalThis.crypto?.subtle : undefined;
  if (!subtle) {
    throw new Error('Web Crypto SubtleCrypto API is unavailable in this runtime.');
  }
  const encoded = new TextEncoder().encode(payload);
  const digest = await subtle.digest('SHA-256', encoded);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface AesGcmSelfTestResult {
  passed: boolean;
  algorithm: 'AES-256-GCM';
  ivBytes: number;
  keyLengthBits: 256;
  ciphertextPreview: string;
  durationMs: number;
  error?: string;
}

export async function runAesGcmRoundtripTest(
  plaintext = 'ErgoSafe-POPIA-Verification-Payload-2026'
): Promise<AesGcmSelfTestResult> {
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  try {
    const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
    if (!cryptoApi?.subtle || !cryptoApi.getRandomValues) {
      throw new Error('Web Crypto AES-GCM unavailable');
    }

    const key = await cryptoApi.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    const iv = cryptoApi.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const cipherBuffer = await cryptoApi.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const cipherBytes = new Uint8Array(cipherBuffer);
    const ciphertextHex = Array.from(cipherBytes.slice(0, 12))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const decryptedBuffer = await cryptoApi.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherBuffer
    );
    const decryptedText = new TextDecoder().decode(decryptedBuffer);

    const passed = decryptedText === plaintext && ciphertextHex.length > 0 && decryptedText !== ciphertextHex;
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();

    return {
      passed,
      algorithm: 'AES-256-GCM',
      ivBytes: iv.byteLength,
      keyLengthBits: 256,
      ciphertextPreview: `${ciphertextHex}... (${cipherBytes.byteLength} bytes)`,
      durationMs: Math.max(1, Math.round(end - start)),
    };
  } catch (err: any) {
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    return {
      passed: false,
      algorithm: 'AES-256-GCM',
      ivBytes: 12,
      keyLengthBits: 256,
      ciphertextPreview: 'N/A',
      durationMs: Math.max(1, Math.round(end - start)),
      error: err?.message || 'AES-256-GCM roundtrip failed',
    };
  }
}

