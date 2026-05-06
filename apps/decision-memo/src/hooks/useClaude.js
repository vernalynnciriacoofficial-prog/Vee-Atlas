import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';

function extractMessage(err) {
  try {
    const match = err.message?.match(/\d{3} (\{.+\})$/s);
    if (match) {
      const body = JSON.parse(match[1]);
      if (body.error?.message) return body.error.message;
    }
  } catch {}
  return err.message || 'Claude API request failed';
}

export function useClaude(apiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function call(systemPrompt, userPrompt) {
    setLoading(true);
    setError(null);
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      return message.content[0].text;
    } catch (err) {
      const msg = extractMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, call };
}
