interface SummaryCardProps {
  summary: string;
  keyPoints: string[];
}

export default function SummaryCard({
  summary,
  keyPoints,
}: SummaryCardProps) {
  return (
    <div
      className="
      relative overflow-hidden
      rounded-3xl
      border border-[#ececf1]
      bg-white
      shadow-xl shadow-violet-100/20
    "
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-violet-50/30 to-transparent pointer-events-none" />

      {/* Header */}
      <div
        className="
        relative z-10
        px-6 py-5
        border-b border-[#ececf1]
        flex items-center justify-between
        bg-white/70 backdrop-blur-xl
      "
      >
        <div className="flex items-center gap-3">
          <div
            className="
            w-11 h-11 rounded-2xl
            bg-gradient-to-br
            from-blue-500
            to-violet-500
            flex items-center justify-center
            text-white
            shadow-lg shadow-violet-200
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <path d="M20 2v4" />
              <path d="M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </svg>
          </div>

          <div>
            <div className="text-[15px] font-semibold text-[#18181b]">
              AI Document Insights
            </div>

            <div className="text-[12px] text-[#71717a] mt-0.5">
              Generated summary & key findings
            </div>
          </div>
        </div>

        <div
          className="
          px-3 py-1
          rounded-full
          text-[10px]
          font-semibold
          uppercase tracking-wider
          bg-gradient-to-r
          from-blue-500
          to-violet-500
          text-white
          shadow-md shadow-violet-200
        "
        >
          AI READY
        </div>
      </div>

      {/* Summary */}
      <div className="relative z-10 px-6 pt-6">
        <div className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#71717a] mb-3">
          Summary
        </div>

        <div
          className="
          text-[15px]
          leading-8
          text-[#3f3f46]
          font-normal
        "
        >
          {summary}
        </div>
      </div>

      {/* Key points */}
      {keyPoints.length > 0 && (
        <div className="relative z-10 px-6 py-6">
          <div className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#71717a] mb-4">
            Key Insights
          </div>

          <div className="grid grid-cols-2 gap-4">
            {keyPoints.map((point, i) => (
              <div
                key={i}
                className="
                group
                relative overflow-hidden
                rounded-2xl
                border border-[#ececf1]
                bg-[#fcfcfd]
                p-4
                transition-all duration-300
                hover:border-violet-200
                hover:shadow-lg hover:shadow-violet-100/20
              "
              >
                {/* hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-50/40 to-violet-50/40 pointer-events-none" />

                <div className="relative z-10 flex items-start gap-3">
                  <div
                    className="
                    w-7 h-7 rounded-xl
                    bg-gradient-to-br
                    from-blue-500
                    to-violet-500
                    flex items-center justify-center
                    text-white
                    text-[11px]
                    font-bold
                    flex-shrink-0
                    shadow-md shadow-violet-200
                  "
                  >
                    {i + 1}
                  </div>

                  <div
                    className="
                    text-[13px]
                    leading-6
                    text-[#3f3f46]
                  "
                  >
                    {point}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}