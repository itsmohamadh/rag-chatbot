'use server'

import "pdf-parse/worker";
import { PDFParse, VerbosityLevel } from "pdf-parse";
import { chunkContent } from "../lib/chunking";
import { generateEmbeddings } from "../lib/embedding";
import db from "@/db";
import { documents } from "@/db/schema";

export async function processPDFFile(formData: FormData) {
  let parser: PDFParse | undefined;

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "PDF file not found", success: false };
    }

    // Convert PDF file to buffer
    const arrayBuffer = await file.arrayBuffer();
    //const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    parser = new PDFParse({
      data: arrayBuffer,
      verbosity: VerbosityLevel.WARNINGS,
    });

    const data = await parser.getText();

    if (!data.text || data.text.length == 0) {
      return { error: "No text found in PDF", success: false };
    }

    const chunks = await chunkContent(data.text);
    const embeddings = await generateEmbeddings(chunks);

    const records = chunks.map((chunk, i) => ({
      content: chunk,
      embedding: embeddings[i],
    }));

    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
  } catch (error) {
    console.error("PDF Processing Error:", error);

    return {
      error: "Failed to process PDF",
      success: false,
    };
  } finally {
    await parser?.destroy();
  }
}
