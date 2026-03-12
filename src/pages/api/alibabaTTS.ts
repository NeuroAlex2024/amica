import type { NextApiRequest, NextApiResponse } from 'next';

import { handleGetConfig } from '@/features/externalAPI/dataHelper';
import { normalizeLanguage } from '@/utils/languageDefaults';

export const config = {
  api: {
    bodyParser: true,
  },
};

function getAlibabaLanguageType(language?: string) {
  switch (normalizeLanguage(language)) {
    case 'zh':
      return 'Chinese';
    case 'ru':
      return 'Russian';
    case 'ja':
      return 'Japanese';
    case 'ko':
      return 'Korean';
    case 'fr':
      return 'French';
    case 'de':
      return 'German';
    case 'es':
      return 'Spanish';
    case 'pt':
      return 'Portuguese';
    case 'id':
      return 'Indonesian';
    case 'en':
    default:
      return 'English';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const storedConfig = handleGetConfig();
  const getValue = (key: string, fallback: string) => {
    return storedConfig?.[key] ?? fallback;
  };

  const apiKey = getValue('alibaba_tts_apikey', getValue('alibaba_apikey', ''));
  if (!apiKey) {
    return res.status(400).json({ error: 'Alibaba Cloud TTS API key is required' });
  }

  const text = req.body?.text;
  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const baseUrl = getValue('alibaba_tts_url', 'https://dashscope-intl.aliyuncs.com').replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/api/v1/services/aigc/multimodal-generation/generation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'disable',
      },
      body: JSON.stringify({
        model: getValue('alibaba_tts_model', 'qwen3-tts-flash'),
        input: {
          text: text.trim(),
          voice: getValue('alibaba_tts_voice', 'Serena') || 'Serena',
          language_type: getAlibabaLanguageType(getValue('language', 'en')),
        },
        parameters: {
          sample_rate: 24000,
          response_format: 'wav',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText || 'Alibaba Cloud TTS request failed');
    }

    const data = await response.json();
    const audioUrl =
      data?.output?.audio?.url ||
      data?.output?.audio_url ||
      data?.output?.url ||
      data?.audio?.url;

    if (!audioUrl) {
      return res.status(500).json({ error: 'Alibaba Cloud TTS did not return an audio URL' });
    }

    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      return res.status(audioResponse.status).send(errorText || 'Failed to download Alibaba TTS audio');
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    res.setHeader('Content-Type', 'audio/wav');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error('Alibaba TTS proxy error', error);
    return res.status(500).json({ error: error?.message || 'Alibaba TTS proxy error' });
  }
}
