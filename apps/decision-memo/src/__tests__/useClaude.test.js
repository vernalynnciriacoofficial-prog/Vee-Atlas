import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClaude } from '../hooks/useClaude';

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(function () {
    return { messages: { create: mockCreate } };
  }),
}));

describe('useClaude', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it('returns text from the API on success', async () => {
    mockCreate.mockResolvedValue({ content: [{ text: '{"ok": true}' }] });

    const { result } = renderHook(() => useClaude('test-key'));
    let text;
    await act(async () => {
      text = await result.current.call('system prompt', 'user prompt');
    });

    expect(text).toBe('{"ok": true}');
  });

  it('loading is true during the call and false after', async () => {
    let resolveCreate;
    mockCreate.mockReturnValue(new Promise(r => { resolveCreate = r; }));

    const { result } = renderHook(() => useClaude('test-key'));

    act(() => {
      result.current.call('system', 'user').catch(() => {});
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveCreate({ content: [{ text: '{}' }] });
    });

    expect(result.current.loading).toBe(false);
  });

  it('sets error and throws when the API fails', async () => {
    mockCreate.mockRejectedValue(new Error('invalid_api_key'));

    const { result } = renderHook(() => useClaude('bad-key'));
    await act(async () => {
      await expect(result.current.call('system', 'user')).rejects.toThrow('invalid_api_key');
    });

    expect(result.current.error).toBe('invalid_api_key');
  });

  it('clears the previous error on a new call', async () => {
    mockCreate
      .mockRejectedValueOnce(new Error('first error'))
      .mockResolvedValueOnce({ content: [{ text: '{}' }] });

    const { result } = renderHook(() => useClaude('test-key'));

    await act(async () => {
      await expect(result.current.call('s', 'u')).rejects.toThrow();
    });
    expect(result.current.error).toBe('first error');

    await act(async () => {
      await result.current.call('s', 'u');
    });
    expect(result.current.error).toBeNull();
  });
});
