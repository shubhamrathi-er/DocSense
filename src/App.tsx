import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import { extractTextFromFile, getFileMetadata } from "./services/pdfExtractor";
import { sendMessage, summarizeDocument } from "./services/aiApi";
import type { Document, Message, ClaudeMessage } from "./types";

let docIdCounter = 1;
let msgIdCounter = 1;

type MessageMap = Record<number, Message[]>;

export default function App() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [messagesByDoc, setMessagesByDoc] = useState<MessageMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeMessages: Message[] = activeDoc
    ? (messagesByDoc[activeDoc.id] ?? [])
    : [];

  // ── Upload handler ──────────────────────────────────────────
  const handleUpload = async (file: File): Promise<void> => {
    const meta = getFileMetadata(file);
    const id = docIdCounter++;

    const newDoc: Document = { id, ...meta };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    setMessagesByDoc((prev) => ({ ...prev, [id]: [] }));

    try {
      setIsLoading(true);

      const { text, pages } = await extractTextFromFile(file);

      const updatedDoc: Document = { ...newDoc, pages, extractedText: text };
      setDocs((prev) => prev.map((d) => (d.id === id ? updatedDoc : d)));
      setActiveDoc(updatedDoc);

      const { summary, keyPoints } = await summarizeDocument(text);

      setMessagesByDoc((prev) => ({
        ...prev,
        [id]: [{ id: msgIdCounter++, type: "summary", summary, keyPoints }],
      }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to process document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Chat handler ────────────────────────────────────────────
  const handleSend = async (userText: string): Promise<void> => {
    if (!activeDoc || isLoading) return;

    const userMsg: Message = {
      id: msgIdCounter++,
      type: "chat",
      role: "user",
      content: userText,
    };

    setMessagesByDoc((prev) => ({
      ...prev,
      [activeDoc.id]: [...(prev[activeDoc.id] ?? []), userMsg],
    }));

    setIsLoading(true);

    try {
      // Build history for Claude — only chat messages, not the summary card
      const history: ClaudeMessage[] = (messagesByDoc[activeDoc.id] ?? [])
        .filter((m): m is Extract<Message, { type: "chat" }> => m.type === "chat")
        .map((m) => ({ role: m.role, content: m.content }));

      history.push({ role: "user", content: userText });

      const systemPrompt = `You are a helpful document assistant. Answer questions based ONLY on the document content below. Be concise and accurate.

DOCUMENT CONTENT:
${activeDoc.extractedText?.slice(0, 2500) ?? "No content available."}`;

      const aiResponse = await sendMessage(history, systemPrompt);

      const aiMsg: Message = {
        id: msgIdCounter++,
        type: "chat",
        role: "assistant",
        content: aiResponse,
      };

      setMessagesByDoc((prev) => ({
        ...prev,
        [activeDoc.id]: [...(prev[activeDoc.id] ?? []), aiMsg],
      }));
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg: Message = {
        id: msgIdCounter++,
        type: "chat",
        role: "assistant",
        content: "Sorry, I couldn't get a response. Please check your connection and try again.",
      };
      setMessagesByDoc((prev) => ({
        ...prev,
        [activeDoc.id]: [...(prev[activeDoc.id] ?? []), errMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen grid overflow-hidden"
      style={{ gridTemplateColumns: "320px 1fr" }}
    >
      <Sidebar
        docs={docs}
        activeDoc={activeDoc}
        onSelectDoc={setActiveDoc}
        onUpload={handleUpload}
      />
      <ChatPanel
        activeDoc={activeDoc}
        messages={activeMessages}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
