export interface Document {
  id: number;
  name: string;
  size: string;
  type: string;
  pages: number | string;
  words?: number | string;
  extractedText?: string;
}

export interface SummaryMessage {
  id: number;
  type: "summary";
  summary: string;
  keyPoints: string[];
}

export interface ChatMessage {
  id: number;
  type: "chat";
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
}

export type Message = SummaryMessage | ChatMessage;

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SummarizeResponse {
  summary: string;
  keyPoints: string[];
}
