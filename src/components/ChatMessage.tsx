import type { Message } from "../types";

interface ChatMessageProps {
  message: Message & { typing?: boolean };
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 150, 300].map((delay, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#b5b2ac] animate-bounce"
          style={{ animationDelay: `${delay}ms`, animationDuration: "1.2s" }}
        />
      ))}
    </div>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.type === "summary") return null;

  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 border ${
          isUser
            ? "bg-[#f0ede8] text-[#8a8680] border-[#d4d0c8]"
            : "bg-blue-50 text-blue-600 border-blue-200"
        }`}
      >
        {isUser ? "SR" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[65%] px-4 py-3 rounded-xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-white border border-[#e8e6e1] text-[#333] rounded-tl-sm"
        }`}
      >
        {message.typing ? <TypingIndicator /> : message.content}
      </div>
    </div>
  );
}
