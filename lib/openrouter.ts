const FREE_MODELS = [
  "deepseek/deepseek-r1",
  "meta-llama/llama-3-8b-instruct",
  "mistralai/mistral-7b-instruct",
  "gryphe/mythomax-l2-13b",
  "google/gemma-7b-it",
  "openchat/openchat-7b"
];

export async function callWithFallback(userIdea: string, refererUrl: string): Promise<string> {
  for (const model of FREE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": refererUrl,
          "X-Title": "PromptDost"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are an expert prompt engineer. Convert the user's simple idea into a detailed, effective, and ready-to-use AI prompt in English. Keep it clear, specific, and optimized for best results."
            },
            {
              role: "user",
              content: `User idea: ${userIdea}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        }),
        // @ts-ignore
        timeout: 10000
      });

      if (!response.ok) continue;

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch {
      continue;
    }
  }

  throw new Error("सभी मॉडल्स व्यस्त हैं। कृपया बाद में प्रयास करें।");
}
