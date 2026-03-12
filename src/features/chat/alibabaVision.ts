import { Message } from './messages';

export async function getAlibabaVisionChatResponse(messages: Message[]): Promise<string> {
  const response = await fetch('/api/alibabaVision/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
    }),
  });

  const reader = response.body?.getReader();
  if (!response.ok || !reader) {
    let errorMessage = `Alibaba vision proxy request failed with status ${response.status}`;

    try {
      const error = await response.json();
      errorMessage = error?.error || error?.message || errorMessage;
    } catch (error) {
      console.error(error);
    }

    throw new Error(errorMessage);
  }

  const decoder = new TextDecoder('utf-8');
  let combined = '';
  let content = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

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
          content += messagePiece;
        }
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          console.error(error);
        }
      }
    }
  }

  reader.releaseLock();
  return content;
}
