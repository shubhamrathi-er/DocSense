interface SummaryCardProps {
  summary: string;
  keyPoints: string[];
}

export default function SummaryCard({ summary, keyPoints }: SummaryCardProps) {
  return (
    <div className="bg-white border border-[#e8e6e1] rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3.5 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs">
          ✦ 
            </div>
        <span className="text-xs font-semibold text-blue-600 tracking-wide">
          AI Generated Summary
        </span>
      </div>

      {/* Summary text */}
      <div className="px-5 py-4 text-sm leading-relaxed text-[#444]">
        {summary}
      </div>

      {/* Key points grid */}
      {keyPoints.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-5 pb-5">
          {keyPoints.map((point, i) => (
            <div
              key={i}
              className="bg-[#f8f7f4] border border-[#e8e6e1] rounded-lg p-3 text-xs text-[#555] leading-relaxed flex gap-2 items-start"
            >
              <div
                className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white font-semibold flex-shrink-0 mt-0.5"
                style={{ fontSize: "9px" }}
              >
                {i + 1}
              </div>
              {point}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
