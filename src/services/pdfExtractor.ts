import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import type { Document } from "../types";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export async function extractTextFromFile(
  file: File
): Promise<{ text: string; pages: number }> {
  const extension =
    file.name.split(".").pop()?.toLowerCase() ?? "";

  // ───────────────── PDF ─────────────────
  if (extension === "pdf") {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) =>
          "str" in item ? item.str : ""
        )
        .join(" ");

      fullText += pageText + "\n";
    }

    return {
      text: fullText.trim(),
      pages: pdf.numPages,
    };

  }

  // ───────────────── DOCX ─────────────────
  if (extension === "docx") {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
      arrayBuffer,
    });

    return {
      text: result.value.trim(),
      pages: 1,
    };

  }

  // ───────────────── TXT ─────────────────
  if (extension === "txt") {
    const text = await file.text();

    return {
      text: text.trim(),
      pages: 1,
    };

  }

  throw new Error(
    "Unsupported file type. Please upload PDF, DOCX, or TXT."
  );
}

export function getFileMetadata(
  file: File
): Omit<Document, "id" | "extractedText"> {
  const sizeKB = file.size / 1024;
  const sizeMB = sizeKB / 1024;

  const size =
    sizeMB >= 1
      ? `${sizeMB.toFixed(1)} MB`
      : `${Math.round(sizeKB)} KB`;

  const ext =
    file.name.split(".").pop()?.toLowerCase() ??
    "unknown";

  return {
    name: file.name,
    size,
    type: ext,
    pages: "...",
  };
}