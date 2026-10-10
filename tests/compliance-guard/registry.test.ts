import { describe, it, expect } from 'vitest';
import { REGISTRY, RegId, renderCitations, formatCitation } from '@/lib/regulations';

describe('Phase 2: Typed, Immutable Regulations Registry', () => {
  it('deep freezes the registry so it cannot be mutated at runtime', () => {
    expect(Object.isFrozen(REGISTRY)).toBe(true);

    // Attempting mutation in strict mode throws TypeError
    expect(() => {
      (REGISTRY as any).OHSA_S8 = { title: 'Mutated' };
    }).toThrow();

    expect(() => {
      (REGISTRY.OHSA_S8 as any).title = 'Mutated Title';
    }).toThrow();
  });

  it('rejects mistyped or unknown regulation tokens', () => {
    // Valid token renders in dev mode
    const rendered = renderCitations('Compliance with [REG:OHSA_S17] required.');
    expect(rendered).toContain('Section 17');

    // Unknown token throws clear error
    expect(() => {
      renderCitations('Invalid reference to [REG:FAKE_INSTRUMENT_999]');
    }).toThrow(/Unknown regulation token: \[REG:FAKE_INSTRUMENT_999\]/);
  });

  it('throws in release mode when unverified citations are rendered', () => {
    expect(() => {
      renderCitations('Testing [REG:OHSA_S17]', { requireVerified: true });
    }).toThrow(/Unverified regulation token in release mode: \[REG:OHSA_S17\]/);
  });

  it('ensures RegId TypeScript type safety rejects invalid IDs at compile-time', () => {
    const validId: RegId = 'OHSA_S17';
    expect(validId).toBe('OHSA_S17');

    // Negative compile-time test: bad ID rejected by tsc
    // @ts-expect-error RegId must not accept an unknown ID
    const badId: RegId = 'INVALID_REG_ID_XYZ';
    expect(badId).toBeDefined();
  });

  it('verifies all 20 required instruments exist and remain unverified until human review', () => {
    const required: RegId[] = [
      'OHSA_S8', 'OHSA_S16_2', 'OHSA_S17', 'OHSA_S24',
      'GSR_3', 'GSR_2', 'ERGO_2019', 'EIR_2009_R7',
      'SANS_10087_1', 'PER_2009', 'SANS_10089_3', 'SANS_10089_2',
      'MHI_2022', 'R638', 'COA', 'HBAR_2022',
      'GPP', 'POPIA_S19', 'POPIA_S26', 'DMR_18'
    ];

    expect(required.length).toBe(20);

    for (const id of required) {
      const entry = REGISTRY[id];
      expect(entry).toBeDefined();
      expect(entry.status).toBe('unverified');
      expect((entry as any).verifiedBy).toBeUndefined();
      expect((entry as any).verifiedOn).toBeUndefined();
      // No invented version or dateVerified fields
      expect((entry as any).version).toBeUndefined();
      expect((entry as any).dateVerified).toBeUndefined();
    }
  });

  it('confirms critical scope notes: SANS 10087-1 (LPG vs PER), PER 2009, MHI 2022, R638 vs COA', () => {
    expect(REGISTRY.SANS_10087_1.scopeNote).toContain('Pressure Equipment Regulations (PER) do not apply to non-pressure fryers');
    expect(REGISTRY.PER_2009.scopeNote).toContain('never for commercial fryers');
    expect(REGISTRY.MHI_2022.scopeNote).toContain('never a default for forecourts');
    expect(REGISTRY.R638.instrument).toContain('Foodstuffs, Cosmetics and Disinfectants Act');
    expect(REGISTRY.COA).toBeDefined();
    expect(REGISTRY.HBAR_2022.scopeNote).toContain('Cold chain is governed under GPP');
  });
});
