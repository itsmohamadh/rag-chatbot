import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const HEADING_REGEX = /^\d{1,2}\.\s+.+$/gm;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 120,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

export function sanitizeText(text: string): string {
  return text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function chunkContent(content: string): Promise<string[]> {
  const sections = splitByHeading(content.trim());
  const chunks: string[] = [];

  for (const section of sections) {
    if (section.length <= 1000) {
      chunks.push(sanitizeText(section));
      continue;
    }

    const heading = section.split("\n")[0];
    const pieces = await splitter.splitText(section);
    for (const piece of pieces) {
      chunks.push(
        piece.startsWith(heading)
          ? sanitizeText(piece)
          : `${heading}: ${sanitizeText(piece)}`,
      );
    }
  }

  return chunks;
}

function splitByHeading(text: string): string[] {
  const headings = [...text.matchAll(HEADING_REGEX)];
  if (headings.length === 0) return [text];

  return headings.map((match, i) => {
    const start = match.index!;
    const end = headings[i + 1]?.index ?? text.length;
    return text.slice(start, end).trim();
  });
}
