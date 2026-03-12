export async function alibabaTTS(
  message: string,
) {
  const res = await fetch('/api/alibabaTTS/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
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
