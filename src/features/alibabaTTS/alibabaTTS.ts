import { config } from '@/utils/config';

export async function alibabaTTS(
  message: string,
) {
  const useServerKey = config('alibaba_tts_use_server_key') === 'true';
  const res = await fetch('/api/alibabaTTS/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
      apiKey: useServerKey ? undefined : config('alibaba_tts_apikey'),
      useServerKey,
      url: config('alibaba_tts_url'),
      model: config('alibaba_tts_model'),
      voice: config('alibaba_tts_voice'),
      language: config('language'),
    }),
  });

  if (!res.ok) {
    let errorMessage = `Alibaba TTS proxy request failed with status ${res.status}`;

    try {
      const error = await res.json();
      errorMessage = error?.error || error?.message || errorMessage;
    } catch (error) {
      console.error(error);
    }

    throw new Error(errorMessage);
  }

  const data = (await res.arrayBuffer()) as any;
  return { audio: data };
}
