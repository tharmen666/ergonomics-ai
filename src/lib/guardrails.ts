/**
 * ErgoSafe Reborn V3 - Input Defense Guardrails
 * Protects statutory assessment endpoints against prompt injection, jailbreaks,
 * code/script injection, and compliance tampering.
 */

export interface ValidationResult {
  isValid: boolean;
  violationCode?: string;
  reason?: string;
  sanitizedInput: string;
}

const MAX_TASK_DESCRIPTION_LENGTH = 2000;
const MIN_TASK_DESCRIPTION_LENGTH = 2;

// Patterns indicating prompt injection or jailbreak attempts
const PROMPT_INJECTION_PATTERNS: Array<{ pattern: RegExp; code: string; reason: string }> = [
  {
    pattern: /\b(?:ignore|disregard|forget|override)\s+(?:all\s+)?(?:previous|prior|above|system)?\s*(?:instructions|prompts|rules|directions|directives|commands)\b/i,
    code: 'PROMPT_INJECTION_ATTEMPT',
    reason: 'Disallowed attempt to override system instructions or prompt boundaries'
  },
  {
    pattern: /\b(?:you\s+are\s+now|act\s+as)\s+(?:an?\s+)?(?:unrestricted|dan|jailbroken|godmode|developer\s+mode|unfiltered)\b/i,
    code: 'JAILBREAK_ATTEMPT',
    reason: 'Disallowed role assumption or jailbreak persona attempt'
  },
  {
    pattern: /\b(?:bypass|disable|circumvent|turn\s+off)\s+(?:the\s+)?(?:guardrails|safety|security|filters|checks|audit\s+log|statutory\s+rules)\b/i,
    code: 'GUARDRAIL_BYPASS_ATTEMPT',
    reason: 'Disallowed attempt to bypass safety guardrails or compliance controls'
  },
  {
    pattern: /\b(?:system\s*prompt|system\s*instructions|developer\s*mode\s*enabled)\b/i,
    code: 'SYSTEM_PROMPT_EXTRACTION',
    reason: 'Disallowed attempt to access or extract system level prompt configuration'
  }
];

// Patterns indicating executable script, HTML injection, or SQL tokens
const CODE_INJECTION_PATTERNS: Array<{ pattern: RegExp; code: string; reason: string }> = [
  {
    pattern: /<\s*script\b[^>]*>|javascript\s*:|data\s*:\s*text\/html|<\s*iframe\b[^>]*>|<\s*svg\b[^>]*on\w+\s*=/i,
    code: 'MALICIOUS_PAYLOAD_DETECTED',
    reason: 'Active executable code, script tags, or script-handler payloads are prohibited'
  },
  {
    pattern: /\b(?:UNION\s+ALL\s+SELECT|UNION\s+SELECT|SELECT\s+.*\s+FROM\s+INFORMATION_SCHEMA|DROP\s+TABLE|ALTER\s+TABLE|TRUNCATE\s+TABLE)\b/i,
    code: 'SQL_INJECTION_ATTEMPT',
    reason: 'Disallowed database manipulation syntax detected'
  }
];

// Patterns indicating statutory compliance tampering or fraud
const COMPLIANCE_TAMPER_PATTERNS: Array<{ pattern: RegExp; code: string; reason: string }> = [
  {
    pattern: /\b(?:falsify|forge|spoof|fake)\s+(?:statutory|ohs|audit|certification|report|assessment)\b/i,
    code: 'STATUTORY_TAMPER_ATTEMPT',
    reason: 'Disallowed attempt to falsify or tamper with statutory safety certifications'
  },
  {
    pattern: /\b(?:delete|drop|wipe|purge|clear)\s+(?:audit\s+trail|statutory\s+logs|compliance\s+records|evidence)\b/i,
    code: 'AUDIT_TAMPER_ATTEMPT',
    reason: 'Disallowed attempt to delete or purge statutory audit records'
  }
];

/**
 * Sanitizes input string by stripping zero-width unicode characters, control characters,
 * and normalizing excessive whitespace.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    // Remove null bytes and control chars (except standard newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove zero-width characters often used for obfuscating injections
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    // Collapse excess whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Validates user-supplied task descriptions or prompts against security,
 * injection, and statutory tamper rules.
 */
export function validateUserInput(taskDescription: unknown): ValidationResult {
  if (taskDescription === undefined || taskDescription === null || typeof taskDescription !== 'string') {
    return {
      isValid: false,
      violationCode: 'INVALID_INPUT_TYPE',
      reason: 'Task description must be a non-empty string',
      sanitizedInput: ''
    };
  }

  const sanitized = sanitizeInput(taskDescription);

  if (sanitized.length < MIN_TASK_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      violationCode: 'EMPTY_INPUT',
      reason: `Task description must be at least ${MIN_TASK_DESCRIPTION_LENGTH} characters long`,
      sanitizedInput: sanitized
    };
  }

  if (sanitized.length > MAX_TASK_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      violationCode: 'EXCEEDS_MAX_LENGTH',
      reason: `Task description exceeds maximum allowable length of ${MAX_TASK_DESCRIPTION_LENGTH} characters`,
      sanitizedInput: sanitized.slice(0, MAX_TASK_DESCRIPTION_LENGTH)
    };
  }

  // Check prompt injections
  for (const item of PROMPT_INJECTION_PATTERNS) {
    if (item.pattern.test(sanitized)) {
      return {
        isValid: false,
        violationCode: item.code,
        reason: item.reason,
        sanitizedInput: sanitized
      };
    }
  }

  // Check code injections
  for (const item of CODE_INJECTION_PATTERNS) {
    if (item.pattern.test(sanitized)) {
      return {
        isValid: false,
        violationCode: item.code,
        reason: item.reason,
        sanitizedInput: sanitized
      };
    }
  }

  // Check compliance tampering
  for (const item of COMPLIANCE_TAMPER_PATTERNS) {
    if (item.pattern.test(sanitized)) {
      return {
        isValid: false,
        violationCode: item.code,
        reason: item.reason,
        sanitizedInput: sanitized
      };
    }
  }

  return {
    isValid: true,
    sanitizedInput: sanitized
  };
}
