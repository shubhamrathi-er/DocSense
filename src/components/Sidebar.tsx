
import { useRef } from "react";
import type { Document } from "../types";

interface SidebarProps {
  docs: Document[];
  activeDoc: Document | null;
  onSelectDoc: (doc: Document) => void;
  onUpload: (file: File) => void;
}

interface DocCardProps {
  doc: Document;
  isActive: boolean;
  onClick: (doc: Document) => void;
}

const DOC_ICONS: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
  }
> = {
  pdf: {
    label: "PDF",
    bg: "bg-red-100",
    text: "text-red-600",
  },
  docx: {
    label: "DOC",
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  txt: {
    label: "TXT",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};

function DocCard({
  doc,
  isActive,
  onClick,
}: DocCardProps) {
  const icon =
    DOC_ICONS[doc.type] ?? DOC_ICONS["txt"];

  return (
    <div
      onClick={() => onClick(doc)}
      className={`
        relative overflow-hidden
        rounded-2xl border
        cursor-pointer
        transition-all duration-300
        mb-3 group
        ${
          isActive
            ? "bg-white border-violet-200 shadow-xl shadow-violet-100/40"
            : "bg-white border-transparent hover:border-[#e5e7eb] hover:shadow-md"
        }
      `}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-violet-500 rounded-r-full" />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`
              w-11 h-11 rounded-xl
              flex items-center justify-center
              text-[11px] font-bold tracking-wide
              flex-shrink-0
              ${icon.bg}
              ${icon.text}
            `}
          >
            {icon.label}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className={`
                text-[14px] font-semibold truncate
                transition-colors
                ${
                  isActive
                    ? "text-violet-700"
                    : "text-[#18181b]"
                }
              `}
            >
              {doc.name}
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-[#f4f4f5] text-[#71717a]">
                {doc.pages} Pages
              </span>

              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-[#f4f4f5] text-[#71717a]">
                {doc.size}
              </span>

              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-violet-50 text-violet-600">
                AI Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  docs,
  activeDoc,
  onSelectDoc,
  onUpload,
}: SidebarProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) onUpload(file);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) onUpload(file);

    e.target.value = "";
  };

  return (
    <aside className="bg-[#fafafa] border-r border-[#ececf1] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#ececf1] bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-[30px] leading-none tracking-tight text-[#111827]"
              style={{
                fontFamily:
                  "'Instrument Serif', serif",
              }}
            >
              DocMind
            </div>

            <div className="text-[12px] text-[#71717a] mt-1">
              AI-powered document workspace
            </div>
          </div>

          <div className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-md shadow-violet-200">
            AI
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="p-5 border-b border-[#ececf1]">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="
            relative overflow-hidden
            rounded-3xl
            border border-[#e4e4e7]
            bg-white
            p-7
            text-center
            cursor-pointer
            transition-all duration-300
            hover:border-violet-300
            hover:shadow-xl
            hover:shadow-violet-100/40
            group
          "
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50" />

          <div className="relative z-10">
            <div
              className="
                w-16 h-16
                mx-auto mb-5
                rounded-2xl
                bg-gradient-to-br
                from-blue-500
                to-violet-500
                flex items-center justify-center
                text-white text-3xl
                shadow-xl shadow-violet-200
              "
            >
              ✨
            </div>

            <div className="text-[15px] font-semibold text-[#18181b]">
              Upload your documents
            </div>

            <div className="text-[13px] text-[#71717a] mt-1 leading-relaxed">
              Drag & drop files or click to browse
            </div>

            <div className="flex justify-center gap-2 flex-wrap mt-5">
              {[
                "PDF",
                "DOCX",
                "TXT",
                "MAX 10MB",
              ].map((tag) => (
                <span
                  key={tag}
                  className="
                    px-2.5 py-1
                    rounded-full
                    text-[10px]
                    font-semibold
                    tracking-wide
                    bg-[#f4f4f5]
                    text-[#71717a]
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71717a]">
              Documents
            </div>

            <div className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[#f4f4f5] text-[#71717a]">
              {docs.length}
            </div>
          </div>

          {docs.length === 0 ? (
            <div className="text-center mt-16">
              <div className="text-5xl mb-4">
                📂
              </div>

              <div className="text-[15px] font-medium text-[#18181b]">
                No documents yet
              </div>

              <div className="text-[13px] text-[#71717a] mt-2 leading-relaxed">
                Upload PDFs, DOCX, or TXT files
                to begin AI analysis.
              </div>
            </div>
          ) : (
            docs.map((doc) => (
              <DocCard
                key={doc.id}
                doc={doc}
                isActive={activeDoc?.id === doc.id}
                onClick={onSelectDoc}
              />
            ))
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />
      </div>
    </aside>
  );
}
