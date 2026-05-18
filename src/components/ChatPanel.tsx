import { useEffect, useRef, useState } from "react";
import type { Document, Message } from "../types";
import ChatMessage from "./ChatMessage";
import SummaryCard from "./SummaryCard";

interface ChatPanelProps {
  activeDoc: Document | null;
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "Summarize this document",
  "What are the key insights?",
  "Extract important skills",
  "What are the risks or concerns?",
];

export default function ChatPanel({
  activeDoc,
  messages,
  onSend,
  isLoading,
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();

    if (!trimmed || isLoading) return;

    onSend(trimmed);

    setInput("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSend();
    }
  };

  const summaryMessage = messages.find(
    (m) => m.type === "summary"
  );

  const chatMessages = messages.filter(
    (m) => m.type === "chat"
  );

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] overflow-hidden">
      {/* Top Bar */}
      <div className="h-[76px] px-8 border-b border-[#ececf1] bg-white/80 backdrop-blur-xl flex items-center justify-between flex-shrink-0">
        {activeDoc ? (
          <>
            <div className="min-w-0">
              <div className="text-[18px] font-semibold text-[#18181b] truncate">
                {activeDoc.name}
              </div>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-[12px] text-[#71717a]">
                  {activeDoc.pages} Pages
                </span>

                <div className="w-1 h-1 rounded-full bg-[#d4d4d8]" />

                <span className="text-[12px] text-[#71717a]">
                  {activeDoc.size}
                </span>

                <div className="w-1 h-1 rounded-full bg-[#d4d4d8]" />

                <span className="text-[12px] text-violet-600 font-medium">
                  AI Processed
                </span>
              </div>
            </div>

            <div
              className="
              px-3 py-1.5 rounded-full
              bg-gradient-to-r
              from-blue-500
              to-violet-500
              text-white
              text-[11px]
              font-semibold
              uppercase tracking-wider
              shadow-lg shadow-violet-200
            "
            >
              AI Workspace
            </div>
          </>
        ) : (
          <div>
            <div className="text-[18px] font-semibold text-[#18181b]">
              AI Document Assistant
            </div>

            <div className="text-[13px] text-[#71717a] mt-1">
              Upload documents and chat with AI
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!activeDoc ? (
          <div className="h-full flex flex-col items-center justify-center px-6">
            <div
              className="
              w-24 h-24 rounded-[28px]
              bg-gradient-to-br
              from-blue-500
              to-violet-500
              flex items-center justify-center
              text-white text-5xl
              shadow-2xl shadow-violet-200
            "
            >
              ✨
            </div>

            <div className="mt-8 text-[30px] font-semibold text-[#18181b] text-center">
              Chat with your documents
            </div>

            <div className="mt-3 text-[15px] text-[#71717a] text-center max-w-[520px] leading-7">
              Upload PDFs, DOCX, or TXT files and
              instantly generate summaries,
              insights, and AI-powered answers.
            </div>

            <div className="grid grid-cols-2 gap-3 mt-10 max-w-[700px] w-full">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  className="
                  p-4 rounded-2xl
                  border border-[#ececf1]
                  bg-white
                  text-left
                  text-[14px]
                  text-[#3f3f46]
                  transition-all duration-300
                  hover:border-violet-200
                  hover:shadow-lg hover:shadow-violet-100/20
                "
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-8 py-8">
            {/* Summary Card */}
            {summaryMessage &&
              summaryMessage.type ===
                "summary" && (
                <div className="mb-8">
                  <SummaryCard
                    summary={
                      summaryMessage.summary
                    }
                    keyPoints={
                      summaryMessage.keyPoints
                    }
                  />
                </div>
              )}

            {/* Chat Messages */}
            <div className="space-y-6">
              {chatMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}

              {/* Typing */}
              {isLoading && (
                <ChatMessage
                  message={{
                    id: -1,
                    type: "chat",
                    role: "assistant",
                    content: "",
                    typing: true,
                  }}
                />
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {activeDoc && (
        <div className="border-t border-[#ececf1] bg-white/80 backdrop-blur-xl p-6">
          <div className="max-w-5xl mx-auto">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setInput(item)
                  }
                  className="
                  px-4 py-2 rounded-full
                  text-[12px]
                  font-medium
                  bg-[#f4f4f5]
                  text-[#52525b]
                  transition-all duration-300
                  hover:bg-violet-50
                  hover:text-violet-600
                "
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div
              className="
              relative overflow-hidden
              rounded-3xl
              border border-[#e4e4e7]
              bg-white
              shadow-lg shadow-black/[0.03]
            "
            >
              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about this document..."
                rows={1}
                className="
                w-full resize-none
                bg-transparent
                px-6 py-5 pr-20
                text-[15px]
                text-[#18181b]
                placeholder:text-[#a1a1aa]
                outline-none
              "
              />

              <button
                onClick={handleSend}
                disabled={
                  !input.trim() || isLoading
                }
                className="
                absolute right-4 bottom-4
                w-12 h-12 rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-violet-500
                text-white
                flex items-center justify-center
                shadow-lg shadow-violet-200
                transition-all duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
                hover:scale-[1.03]
                active:scale-[0.98]
              "
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}