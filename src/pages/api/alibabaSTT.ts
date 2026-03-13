import type { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import formidable from 'formidable';

import { requestAlibabaSTT } from '@/features/alibabaSTT/requestAlibabaSTT';
import { getStoredConfigValue, readStoredConfig } from '@/utils/readStoredConfig';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getFieldValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const storedConfig = readStoredConfig();
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Alibaba STT form parsing error', err);
      return res.status(400).json({ error: 'Failed to parse form data' });
    }

    const payload = Array.isArray(files?.file) ? files.file[0] : files?.file;
    if (!payload) {
      return res.status(400).json({ error: 'file is required' });
    }

    const useServerKey = getFieldValue(fields?.useServerKey) === 'true';
    const serverKey =
      process.env.ALIBABA_STT_APIKEY ||
      process.env.ALIBABA_APIKEY ||
      process.env.NEXT_PUBLIC_ALIBABA_STT_APIKEY ||
      process.env.NEXT_PUBLIC_ALIBABA_APIKEY ||
      '';
    const apiKey = useServerKey
      ? serverKey
      : getFieldValue(fields?.apiKey) ||
        getStoredConfigValue(
          storedConfig,
          'alibaba_stt_apikey',
          getStoredConfigValue(storedConfig, 'alibaba_apikey', serverKey),
        );

    if (!apiKey) {
      return res.status(400).json({ error: 'Alibaba Cloud STT API key is required' });
    }

    try {
      const fileBuffer = fs.readFileSync(payload.filepath);
      const file = new File(
        [fileBuffer],
        payload.originalFilename || 'input.wav',
        { type: payload.mimetype || 'audio/wav' },
      );
      const url =
        (getFieldValue(fields?.url) ||
          getStoredConfigValue(
            storedConfig,
            'alibaba_stt_url',
            getStoredConfigValue(
              storedConfig,
              'alibaba_url',
              'https://dashscope-intl.aliyuncs.com/compatible-mode',
            ),
          )).replace(/\/+$/, '');
      const model =
        getFieldValue(fields?.model) ||
        getStoredConfigValue(storedConfig, 'alibaba_stt_model', 'qwen3-asr-flash-2026-02-10');
      const language =
        getFieldValue(fields?.language) ||
        getStoredConfigValue(storedConfig, 'language', 'en');
      const prompt = getFieldValue(fields?.prompt);

      const result = await requestAlibabaSTT(file, {
        apiKey,
        url,
        model,
        language,
        prompt,
      });

      return res.status(200).json({ text: result.text });
    } catch (error: any) {
      console.error('Alibaba STT proxy error', error);
      return res.status(500).json({ error: error?.message || 'Alibaba STT proxy error' });
    }
  });
}
