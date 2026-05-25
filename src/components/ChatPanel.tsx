import { useState, useRef, useEffect } from "react";
import type { Document, Message } from "../types";
import ChatMessage from "./ChatMessage";
import SummaryCard from "./SummaryCard";

interface ChatPanelProps {
  activeDoc: Document | null;
  messages: Message[];
  onSend: (text: string) => void;
  isLoading: boolean;
  onMenuClick: () => void; // ← new
}

const SUGGESTIONS = [
  "What are the key risks?",
  "Summarize action items",
  "Who are the stakeholders?",
  "Timeline overview",
] as const;

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function ChatPanel({
  activeDoc,
  messages,
  onSend,
  isLoading,
  onMenuClick,
}: ChatPanelProps) {
  const [input, setInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || isLoading) return;
    onSend(msg);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const summaryMessage = messages.find((m) => m.type === "summary");
  const chatMessages = messages.filter((m) => m.type === "chat");

  if (!activeDoc) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#f8f7f4]">
        {/* Mobile topbar for empty state */}
        <div className="md:hidden bg-white border-b border-[#e8e6e1] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="text-[#8a8680] hover:text-[#1a1916] transition-colors"
          >
            <MenuIcon />
          </button>
          <div
            className="text-[18px] text-[#1a1916]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            DocSense
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="text-5xl mb-4">📄</div>
            <div className="text-[15px] font-medium text-[#1a1916] mb-2">
              No document selected
            </div>
            <div className="text-sm text-[#8a8680]">
              Upload a PDF to start chatting with it
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-[#f8f7f4]">

      {/* Top bar */}
      <div className="bg-white border-b border-[#e8e6e1] px-4 md:px-7 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-[#8a8680] hover:text-[#1a1916] transition-colors flex-shrink-0"
          >
            <MenuIcon />
          </button>

          <div
            className="text-[16px] md:text-[19px] text-[#1a1916] truncate"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {activeDoc.name.replace(/\.[^.]+$/, "")}
          </div>

          {summaryMessage && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Analyzed
            </div>
          )}
        </div>

        {/* Action buttons — hidden on small mobile */}
        <div className="hidden sm:flex gap-2">
          {["Export", "Share"].map((label) => (
            <button
              key={label}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#d4d0c8] bg-white text-[#8a8680] hover:bg-[#f8f7f4] hover:text-[#1a1916] transition-all"
            >
              {label}
            </button>
          ))}
          <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all">
            + New Chat
          </button>
        </div>
      </div>

      {/* Stats bar — hidden on mobile */}
      <div className="hidden md:flex bg-white border-b border-[#e8e6e1] px-7 py-3 gap-7 flex-shrink-0">
        {[
          { label: "Pages", value: activeDoc.pages },
          { label: "Words", value: activeDoc.words ?? "—" },
          { label: "Size", value: activeDoc.size },
          {
            label: "AI Summary",
            value: summaryMessage ? "Ready" : "Processing...",
            green: !!summaryMessage,
          },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs text-[#8a8680]">
            {s.label}
            <span className={`font-mono font-medium text-[13px] ml-0.5 ${s.green ? "text-emerald-600" : "text-[#1a1916]"}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-7 py-5 md:py-7 flex flex-col gap-4 md:gap-5">
        {summaryMessage?.type === "summary" && (
          <SummaryCard
            summary={summaryMessage.summary}
            keyPoints={summaryMessage.keyPoints}
          />
        )}

        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <ChatMessage
            message={{ id: -1, type: "chat", role: "assistant", content: "", typing: true }}
          />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-[#e8e6e1] px-4 md:px-7 py-3 md:py-4 flex-shrink-0">
        {/* Suggestion chips — scrollable on mobile */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-[#d4d0c8] bg-[#f8f7f4] text-[#8a8680] hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap flex-shrink-0"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex gap-2.5 items-center bg-[#f8f7f4] border-[1.5px] border-[#d4d0c8] rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all">
          <input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this document..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#1a1916] placeholder-[#b5b2ac]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-px flex-shrink-0"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </main>
  );
}