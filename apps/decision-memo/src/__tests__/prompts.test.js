import { describe, it, expect } from 'vitest';
import { buildExtractStructurePrompt } from '../prompts/extractStructure';
import { buildGenerateMemoPrompt } from '../prompts/generateMemo';

describe('buildExtractStructurePrompt', () => {
  it('includes the user text in the user prompt', () => {
    const { user } = buildExtractStructurePrompt('We must decide on vendor selection.');
    expect(user).toContain('We must decide on vendor selection.');
  });

  it('instructs Claude to begin the response with {', () => {
    const { user } = buildExtractStructurePrompt('test');
    expect(user).toContain('Begin your response with {');
  });

  it('system prompt instructs JSON-only output', () => {
    const { system } = buildExtractStructurePrompt('test');
    expect(system.toLowerCase()).toContain('json');
    expect(system).toContain('no markdown');
  });

  it('returns both system and user keys', () => {
    const result = buildExtractStructurePrompt('test');
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('user');
  });
});

describe('buildGenerateMemoPrompt', () => {
  const sampleData = {
    title: 'Designer Hiring Decision',
    context: 'We need design capacity before Q3.',
    constraints: ['$50k budget', 'Q3 deadline'],
    stakeholders: ['CEO', 'Head of Product'],
    options: [
      { name: 'Hire FT', description: 'Full-time hire' },
      { name: 'Contract', description: 'Contract designer' },
    ],
  };

  it('includes the decision title in the user prompt', () => {
    const { user } = buildGenerateMemoPrompt(sampleData);
    expect(user).toContain('Designer Hiring Decision');
  });

  it('includes all option names in the user prompt', () => {
    const { user } = buildGenerateMemoPrompt(sampleData);
    expect(user).toContain('Hire FT');
    expect(user).toContain('Contract');
  });

  it('instructs Claude to begin the response with {', () => {
    const { user } = buildGenerateMemoPrompt(sampleData);
    expect(user).toContain('Begin your response with {');
  });

  it('system prompt enforces the risk enum', () => {
    const { system } = buildGenerateMemoPrompt(sampleData);
    expect(system).toContain('"Low"');
    expect(system).toContain('"Medium"');
    expect(system).toContain('"High"');
  });

  it('returns both system and user keys', () => {
    const result = buildGenerateMemoPrompt(sampleData);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('user');
  });
});
