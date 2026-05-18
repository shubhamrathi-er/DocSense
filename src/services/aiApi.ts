import type { ClaudeMessage, SummarizeResponse } from "../types";

const AI_API_URL = "http://localhost:3001/api/ai";

export async function sendMessage(
  messages: ClaudeMessage[],
  systemPrompt: string
): Promise<string> {
  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to get response from AI");
  }

  const data = await response.json() as { content: string };
  return data.content;
}

export async function summarizeDocument(
  documentText: string
): Promise<SummarizeResponse> {
  const prompt = `You are an expert document analyst. Analyze the following document and respond ONLY with a valid JSON object in this exact format, no markdown, no extra text:
{
  "summary": "2-3 sentence overview of the document",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"]
}

Document text:
${documentText.slice(0, 2500)}`;

  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      systemPrompt: "You are a document analysis assistant. Always respond with valid JSON only.",
    }),
  });

 if (!response.ok) {
  const err = await response.json().catch(() => ({}));

  throw new Error(
    (err as { error?: string }).error ||
      "Failed to summarize document"
  );
}

  const data = await response.json() as { content: string };

  try {
    const cleaned = data.content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as SummarizeResponse;
  } catch {
    return { summary: data.content, keyPoints: [] };
  }
}
