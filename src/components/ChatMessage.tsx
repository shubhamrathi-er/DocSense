import type { Message } from "../types";

interface ChatMessageProps {
  message: Message & { typing?: boolean };
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 150, 300].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
          style={{
            animationDelay: `${delay}ms`,
            animationDuration: "1.2s",
          }}
        />
      ))}

      <span className="text-[12px] text-[#71717a] ml-2">
        AI is thinking...
      </span>
    </div>
  );
}

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  if (message.type === "summary") return null;

  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          className="
          w-10 h-10 rounded-2xl
          bg-gradient-to-br
          from-blue-500
          to-violet-500
          flex items-center justify-center
          text-white text-sm font-semibold
          shadow-lg shadow-violet-200
          flex-shrink-0
        "
        >
          AI
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`
          max-w-[72%]
          px-5 py-4
          rounded-3xl
          text-[14px]
          leading-relaxed
          transition-all duration-300
          shadow-sm
          ${
            isUser
              ? `
                bg-gradient-to-r
                from-blue-500
                to-violet-500
                text-white
                rounded-br-md
                shadow-lg shadow-violet-200/40
              `
              : `
                bg-white
                border border-[#ececf1]
                text-[#18181b]
                rounded-bl-md
              `
          }
        `}
      >
        {message.typing ? (
          <TypingIndicator />
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className="
          w-10 h-10 rounded-2xl
          bg-[#f4f4f5]
          border border-[#e4e4e7]
          flex items-center justify-center
          text-[#52525b]
          text-sm font-semibold
          flex-shrink-0
        "
        >
          SR
        </div>
      )}
    </div>
  );
}