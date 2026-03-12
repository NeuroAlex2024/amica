import { Message } from './messages';
import { config } from '@/utils/config';

export async function getAlibabaChatResponseStream(messages: Message[]): Promise<ReadableStream> {
  const useServerKey = config('alibaba_use_server_key') === 'true';
  const response = await fetch('/api/alibabaChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      apiKey: useServerKey ? undefined : config('alibaba_apikey'),
      useServerKey,
      url: config('alibaba_url'),
      model: config('alibaba_model'),
      enableThinking: config('alibaba_enable_thinking') === 'true',
    }),
  });

  const reader = response.body?.getReader();
  if (!response.ok || !reader) {
    let errorMessage = `Alibaba proxy request failed with status ${response.status}`;

    try {
      const error = await response.json();
      errorMessage = error?.error?.message || error?.message || errorMessage;
    } catch (error) {
      console.error(error);
    }

    throw new Error(errorMessage);
  }

  return new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder('utf-8');

      try {
        let combined = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const data = decoder.decode(value);
          const chunks = data
            .split('data:')
            .filter((val) => !!val && val.trim() !== '[DONE]');

          for (const chunk of chunks) {
            if (chunk.length > 0 && chunk[0] === ':') {
              continue;
            }

            combined += chunk;

            try {
              const json = JSON.parse(combined);
              const messagePiece = json.choices?.[0]?.delta?.content;
              combined = '';

              if (messagePiece) {
                controller.enqueue(messagePiece);
              }
            } catch (error) {
              if (!(error instanceof SyntaxError)) {
                console.error(error);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
    async cancel() {
      await reader.cancel();
      reader.releaseLock();
    },
  });
}
