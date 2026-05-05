import { describe, it, expect } from 'vitest';
import { validateExtractStructure, validateGenerateMemo } from '../utils/validateJson';

// ── validateExtractStructure ─────────────────────────────────────────────────

describe('validateExtractStructure', () => {
  const valid = {
    title: 'Should we hire a designer?',
    context: 'Budget is tight and launch is Q3.',
    constraints: ['$50k budget'],
    stakeholders: ['CEO'],
    options: [
      { name: 'Hire FT', description: 'Full-time hire' },
      { name: 'Contract', description: 'Contract designer' },
    ],
  };

  it('passes for a valid response', () => {
    expect(() => validateExtractStructure(valid)).not.toThrow();
  });

  it('throws when title is missing', () => {
    expect(() => validateExtractStructure({ ...valid, title: '' })).toThrow();
  });

  it('throws when title is under 10 characters', () => {
    expect(() => validateExtractStructure({ ...valid, title: 'Short' })).toThrow();
  });

  it('throws when context is under 10 characters', () => {
    expect(() => validateExtractStructure({ ...valid, context: 'Brief.' })).toThrow();
  });

  it('throws when options has fewer than 2 items', () => {
    expect(() => validateExtractStructure({ ...valid, options: [valid.options[0]] })).toThrow();
  });

  it('throws when an option has no name', () => {
    const bad = { ...valid, options: [{ name: '', description: 'desc' }, { name: 'B', description: 'desc' }] };
    expect(() => validateExtractStructure(bad)).toThrow();
  });
});

// ── validateGenerateMemo ─────────────────────────────────────────────────────

describe('validateGenerateMemo', () => {
  const validOption = {
    name: 'Hire Full-Time',
    description: 'Bring on a full-time designer at market rate.',
    pros: ['Full control', 'Faster ramp-up'],
    cons: ['Higher cost', 'Slower to hire'],
    risk: 'Medium',
  };

  const valid = {
    context: 'The company needs design capacity before the Q3 launch.',
    options: [validOption, { ...validOption, name: 'Contract Out' }],
    recommendation: 'We recommend contracting out given the budget constraints.',
    nextSteps: ['Post job on Toptal', 'Define scope'],
  };

  it('passes for a valid response', () => {
    expect(() => validateGenerateMemo(valid)).not.toThrow();
  });

  it('throws when context is under 10 characters', () => {
    expect(() => validateGenerateMemo({ ...valid, context: 'Short.' })).toThrow();
  });

  it('throws when recommendation is under 10 characters', () => {
    expect(() => validateGenerateMemo({ ...valid, recommendation: 'Hire.' })).toThrow();
  });

  it('throws when options has fewer than 2 items', () => {
    expect(() => validateGenerateMemo({ ...valid, options: [validOption] })).toThrow();
  });

  it('throws when an option description is under 10 characters', () => {
    const bad = { ...valid, options: [{ ...validOption, description: 'Short.' }, validOption] };
    expect(() => validateGenerateMemo(bad)).toThrow();
  });

  it('throws when an option has fewer than 2 pros', () => {
    const bad = { ...valid, options: [{ ...validOption, pros: ['Only one'] }, validOption] };
    expect(() => validateGenerateMemo(bad)).toThrow();
  });

  it('throws when an option has fewer than 2 cons', () => {
    const bad = { ...valid, options: [{ ...validOption, cons: ['Only one'] }, validOption] };
    expect(() => validateGenerateMemo(bad)).toThrow();
  });

  it('silently defaults risk to Medium when the value is invalid', () => {
    const data = {
      ...valid,
      options: [{ ...validOption, risk: 'Unknown' }, validOption],
    };
    validateGenerateMemo(data);
    expect(data.options[0].risk).toBe('Medium');
  });
});
