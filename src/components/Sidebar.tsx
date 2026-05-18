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

const DOC_ICONS: Record<string, string> = {
  pdf: "📋",
  doc: "📄",
  docx: "📄",
  txt: "📝",
  xls: "📊",
  xlsx: "📊",
};

function DocCard({ doc, isActive, onClick }: DocCardProps) {
  return (
    <div
      onClick={() => onClick(doc)}
      className={`p-4 rounded-xl cursor-pointer transition-all mb-1 border ${
        isActive
          ? "bg-blue-50 border-blue-200"
          : "border-transparent hover:bg-[#f8f7f4] hover:border-[#e8e6e1]"
      }`}
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0 ${
            isActive ? "bg-blue-100" : "bg-[#f0ede8]"
          }`}
        >
          {DOC_ICONS[doc.type] ?? "📄"}
        </div>
        <div className="min-w-0">
          <div
            className={`text-[13px] font-medium leading-snug truncate ${
              isActive ? "text-blue-600" : "text-[#1a1916]"
            }`}
          >
            {doc.name}
          </div>
          <div className="flex gap-2 mt-1">
            <span className="font-mono text-[9px] text-[#b5b2ac] bg-[#f0ede8] px-1.5 py-0.5 rounded">
              {doc.pages} PAGES
            </span>
            <span className="font-mono text-[9px] text-[#b5b2ac] bg-[#f0ede8] px-1.5 py-0.5 rounded">
              {doc.size}
            </span>
          </div>
        </div>
      </div>

      {isActive && (
        <div className="h-0.5 bg-[#e8e6e1] rounded overflow-hidden">
          <div className="h-full bg-blue-600 rounded w-full" />
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ docs, activeDoc, onSelectDoc, onUpload }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <aside className="bg-white border-r border-[#e8e6e1] flex flex-col overflow-hidden">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-[#e8e6e1] flex items-center justify-between flex-shrink-0">
        <div
          className="text-2xl text-[#1a1916] tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Document Summarizer
        </div>
        <div className="font-mono text-[9px] bg-blue-600 text-white px-2 py-1 rounded-full tracking-wide">
          AI BETA
        </div>
      </div>

      {/* Upload zone */}
      <div className="p-4 border-b border-[#e8e6e1] flex-shrink-0">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#d4d0c8] rounded-xl p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 group"
        >
          <div className="text-3xl mb-2">📎</div>
          <div className="text-[13px] text-[#8a8680] leading-relaxed">
            <span className="text-blue-600 font-medium group-hover:underline">
              Upload document
            </span>
            <br />
            Drag & drop or click to browse
          </div>
          <div className="flex gap-1.5 justify-center flex-wrap mt-2">
            {["PDF", "DOCX", "TXT", "MAX 10MB"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] bg-[#f0ede8] text-[#8a8680] px-2 py-0.5 rounded tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-semibold text-[#8a8680] uppercase tracking-widest">
            Documents
          </span>
          <span className="font-mono text-[10px] bg-[#f0ede8] text-[#8a8680] px-2 py-0.5 rounded-full">
            {docs.length}
          </span>
        </div>

        {docs.length === 0 ? (
          <div className="text-center text-[13px] text-[#b5b2ac] mt-8 leading-relaxed">
            No documents yet.
            <br />
            Upload one to get started.
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
    </aside>
  );
}