import { normalizeLanguage } from '@/utils/languageDefaults';

export type AlibabaSTTRequestOptions = {
  apiKey: string;
  url: string;
  model: string;
  language?: string;
  prompt?: string;
};

export async function requestAlibabaSTT(
  file: File,
  { apiKey, url, model, language, prompt }: AlibabaSTTRequestOptions,
) {
  const baseUrl = url.replace(/\/+$/, '');
  const endpoint = baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : baseUrl.endsWith('/v1')
      ? `${baseUrl}/chat/completions`
      : `${baseUrl}/v1/chat/completions`;
  const normalizedLanguage = normalizeLanguage(language || '');
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = file.type || 'audio/wav';
  const asrOptions: Record<string, string | boolean> = {
    enable_itn: false,
  };

  if (normalizedLanguage) {
    asrOptions.language = normalizedLanguage;
  }

  const messages: Array<{
    role: 'system' | 'user';
    content: Array<Record<string, unknown>>;
  }> = [];

  if (prompt?.trim()) {
    messages.push({
      role: 'system',
      content: [
        {
          text: prompt.trim(),
        },
      ],
    });
  }

  messages.push({
    role: 'user',
    content: [
      {
        type: 'input_audio',
        input_audio: {
          data: `data:${mimeType};base64,${base64}`,
        },
      },
    ],
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      asr_options: asrOptions,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Alibaba STT request failed (${res.status})`);
  }

  const data = await res.json();
  return { text: data?.choices?.[0]?.message?.content?.trim?.() || '', raw: data };
}
