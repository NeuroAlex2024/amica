import { config } from '@/utils/config';

export async function alibabaSTT(
  file: File,
  prompt?: string,
) {
  const useServerKey = config('alibaba_stt_use_server_key') === 'true';
  const formData = new FormData();

  formData.append('file', file);
  formData.append('useServerKey', useServerKey ? 'true' : 'false');
  formData.append('url', config('alibaba_stt_url'));
  formData.append('model', config('alibaba_stt_model'));
  formData.append('language', config('language'));

  if (!useServerKey) {
    formData.append('apiKey', config('alibaba_stt_apikey'));
  }

  if (prompt) {
    formData.append('prompt', prompt);
  }

  const res = await fetch('/api/alibabaSTT', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Alibaba STT proxy request failed with status ${res.status}`;

    try {
      const error = await res.json();
      errorMessage = error?.error || error?.message || errorMessage;
    } catch (error) {
      console.error(error);
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();
  return { text: data?.text?.trim?.() || '' };
}
