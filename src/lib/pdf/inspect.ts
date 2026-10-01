import {
  classifyPdfAsync,
  extractPagesMarkdownAsync,
  extractTextWithPositionsAsync,
} from "@firecrawl/pdf-inspector";
import {
  InspectError,
  type NormalizedDocument,
  type NormalizedPage,
  type PdfKind,
} from "./types";

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export const MAX_PDF_PAGES = 50;

// pdf-inspector declares PdfType as an ambient const enum, which can't be used
// under isolatedModules, so key by its string values.
const KIND_BY_TYPE: Record<string, PdfKind> = {
  TextBased: "text",
  Scanned: "scanned",
  ImageBased: "image",
  Mixed: "mixed",
};

function assertPdf(buffer: Buffer): void {
  if (buffer.length > MAX_PDF_BYTES) {
    throw new InspectError("too_large", "PDF exceeds the 10MB limit.");
  }
  // Check the magic bytes, not the file name or MIME type, both of which the
  // client controls. Spec allows the header within the first 1024 bytes.
  if (!buffer.subarray(0, 1024).includes("%PDF-")) {
    throw new InspectError("not_a_pdf", "File is not a PDF.");
  }
}

export async function inspectPdf(buffer: Buffer): Promise<NormalizedDocument> {
  assertPdf(buffer);

  try {
    const classification = await classifyPdfAsync(buffer);
    if (classification.pageCount > MAX_PDF_PAGES) {
      throw new InspectError(
        "too_many_pages",
        `PDF has more than ${MAX_PDF_PAGES} pages.`,
      );
    }

    const [markdown, items] = await Promise.all([
      extractPagesMarkdownAsync(buffer),
      extractTextWithPositionsAsync(buffer),
    ]);

    const pagesWithTables = new Set(markdown.pagesWithTables);
    const pages: NormalizedPage[] = markdown.pages.map((p) => {
      const page = p.page + 1; // pdf-inspector page indices here are 0-based
      return {
        page,
        markdown: p.markdown,
        needsOcr: p.needsOcr,
        hasTables: pagesWithTables.has(page),
        items: [],
      };
    });
    const byPage = new Map(pages.map((p) => [p.page, p]));

    for (const item of items) {
      byPage.get(item.page)?.items.push({
        page: item.page,
        text: item.text,
        bbox: { x: item.x, y: item.y, width: item.width, height: item.height },
        fontSize: item.fontSize,
        isBold: item.isBold,
      });
    }

    return {
      kind: KIND_BY_TYPE[classification.pdfType] ?? "mixed",
      confidence: classification.confidence,
      pageCount: classification.pageCount,
      pages,
      pagesNeedingOcr: markdown.pagesNeedingOcr,
    };
  } catch (err) {
    if (err instanceof InspectError) throw err;
    // Never include err.message: parser errors can echo document content.
    throw new InspectError("unreadable", "Could not read this PDF.");
  }
}
