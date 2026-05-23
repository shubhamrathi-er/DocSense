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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const activeMessages: Message[] = activeDoc
    ? (messagesByDoc[activeDoc.id] ?? [])
    : [];

  const handleUpload = async (file: File): Promise<void> => {
    const meta = getFileMetadata(file);
    const id = docIdCounter++;

    const newDoc: Document = { id, ...meta };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    setMessagesByDoc((prev) => ({ ...prev, [id]: [] }));
    setSidebarOpen(false); // close sidebar on mobile after upload

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
      const history: ClaudeMessage[] = (messagesByDoc[activeDoc.id] ?? [])
        .filter((m): m is Extract<Message, { type: "chat" }> => m.type === "chat")
        .map((m) => ({ role: m.role, content: m.content }));

      history.push({ role: "user", content: userText });

      const systemPrompt = `You are a helpful document assistant. Answer questions based ONLY on the document content below. Be concise and accurate.

DOCUMENT CONTENT:
${activeDoc.extractedText?.slice(0, 8000) ?? "No content available."}`;

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

  const handleSelectDoc = (doc: Document) => {
    setActiveDoc(doc);
    setSidebarOpen(false); // close sidebar on mobile after selecting doc
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#f8f7f4]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-[300px]
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-[280px] lg:w-[320px]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar
          docs={docs}
          activeDoc={activeDoc}
          onSelectDoc={handleSelectDoc}
          onUpload={handleUpload}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <ChatPanel
          activeDoc={activeDoc}
          messages={activeMessages}
          onSend={handleSend}
          isLoading={isLoading}
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>
    </div>
  );
}