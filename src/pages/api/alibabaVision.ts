import type { NextApiRequest, NextApiResponse } from 'next';

import { handleGetConfig } from '@/features/externalAPI/dataHelper';
import { Message } from '@/features/chat/messages';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const storedConfig = handleGetConfig();
  const getValue = (key: string, fallback: string) => {
    return storedConfig?.[key] ?? fallback;
  };

  const apiKey = getValue('vision_alibaba_apikey', getValue('alibaba_apikey', ''));
  if (!apiKey) {
    return res.status(400).json({ error: 'Alibaba Cloud Vision API key is required' });
  }

  const messages = (req.body?.messages || []) as Message[];
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  try {
    const response = await fetch(`${getValue('vision_alibaba_url', getValue('alibaba_url', 'https://dashscope-intl.aliyuncs.com/compatible-mode'))}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://amica.arbius.ai',
        'X-Title': 'Amica Vision',
      },
      body: JSON.stringify({
        model: getValue('vision_alibaba_model', 'qwen3.5-plus'),
        messages: messages.map(({ role, content }) => ({ role, content })),
        stream: true,
        max_tokens: 200,
      }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText || 'Alibaba Cloud vision request failed');
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error: any) {
    console.error('Alibaba vision proxy error', error);
    return res.status(500).json({ error: error?.message || 'Alibaba vision proxy error' });
  }
}
