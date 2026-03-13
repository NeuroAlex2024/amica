import { requestAlibabaSTT } from '@/features/alibabaSTT/requestAlibabaSTT';
import { openaiWhisper } from '@/features/openaiWhisper/openaiWhisper';
import { whispercpp } from '@/features/whispercpp/whispercpp';
import { config } from '@/utils/config';

export async function transcribeVoice(audio: File): Promise<string> {
  try {
    switch (config('stt_backend')) {
      case 'whisper_openai': {
        const result = await openaiWhisper(audio);
        return result?.text; 
      }
      case 'whispercpp': {
        const result = await whispercpp(audio);
        return result?.text;
      }
      case 'alibaba_stt': {
        const useServerKey = config('alibaba_stt_use_server_key') === 'true';
        const serverKey =
          process.env.ALIBABA_STT_APIKEY ||
          process.env.ALIBABA_APIKEY ||
          process.env.NEXT_PUBLIC_ALIBABA_STT_APIKEY ||
          process.env.NEXT_PUBLIC_ALIBABA_APIKEY ||
          '';
        const apiKey = useServerKey ? serverKey : config('alibaba_stt_apikey') || config('alibaba_apikey');

        if (!apiKey) {
          throw new Error('Invalid Alibaba Cloud STT API Key');
        }

        const result = await requestAlibabaSTT(audio, {
          apiKey,
          url: config('alibaba_stt_url'),
          model: config('alibaba_stt_model'),
          language: config('language'),
        });
        return result?.text;
      }
      default:
        throw new Error('Invalid STT backend configuration.');
    }
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio.');
  }
}
