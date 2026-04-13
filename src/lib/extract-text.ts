import mammoth from "mammoth";
import pdfParse from "pdf-parse";

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function extractTextFromFile(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    const result = await pdfParse(bytes);
    return normalizeWhitespace(result.text);
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: bytes });
    return normalizeWhitespace(result.value);
  }

  return normalizeWhitespace(bytes.toString("utf8"));
}
