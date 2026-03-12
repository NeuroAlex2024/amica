import type { NextApiRequest, NextApiResponse } from 'next';

import { normalizeLanguage } from '@/utils/languageDefaults';
import { getStoredConfigValue, readStoredConfig } from '@/utils/readStoredConfig';

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

  const storedConfig = readStoredConfig();

  const useServerKey = req.body?.useServerKey === true;
  const serverKey = process.env.ALIBABA_TTS_APIKEY || process.env.ALIBABA_APIKEY || process.env.NEXT_PUBLIC_ALIBABA_TTS_APIKEY || process.env.NEXT_PUBLIC_ALIBABA_APIKEY || '';
  const apiKey = useServerKey
    ? serverKey
    : req.body?.apiKey || getStoredConfigValue(storedConfig, 'alibaba_tts_apikey', getStoredConfigValue(storedConfig, 'alibaba_apikey', serverKey));
  if (!apiKey) {
    return res.status(400).json({ error: 'Alibaba Cloud TTS API key is required' });
  }

  const text = req.body?.text;
  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const baseUrl = (req.body?.url || getStoredConfigValue(storedConfig, 'alibaba_tts_url', 'https://dashscope-intl.aliyuncs.com')).replace(/\/+$/, '');
    const model = req.body?.model || getStoredConfigValue(storedConfig, 'alibaba_tts_model', 'qwen3-tts-flash');
    const voice = req.body?.voice || getStoredConfigValue(storedConfig, 'alibaba_tts_voice', 'Chelsie') || 'Chelsie';
    const language = req.body?.language || getStoredConfigValue(storedConfig, 'language', 'en');

    const response = await fetch(`${baseUrl}/api/v1/services/aigc/multimodal-generation/generation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'disable',
      },
      body: JSON.stringify({
        model,
        input: {
          text: text.trim(),
          voice,
          language_type: getAlibabaLanguageType(language),
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
