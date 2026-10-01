// Internal document representation. Everything downstream (extraction,
// verification, evidence UI) depends on these types only, never on the raw
// pdf-inspector output, so the extractor can be swapped without ripple effects.

export type PdfKind = "text" | "scanned" | "image" | "mixed";

/** Axis-aligned box in PDF points, origin at the page's lower-left, y up. */
export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedTextItem {
  /** 1-indexed page number. */
  page: number;
  text: string;
  bbox: BBox;
  fontSize: number;
  isBold: boolean;
}

export interface NormalizedPage {
  /** 1-indexed page number. */
  page: number;
  items: NormalizedTextItem[];
  /** Reading-order markdown for the page (tables rendered as markdown tables). */
  markdown: string;
  hasTables: boolean;
  /** True when the text layer is unreliable and OCR is required. */
  needsOcr: boolean;
}

export interface NormalizedDocument {
  kind: PdfKind;
  /** Classifier confidence, 0..1. */
  confidence: number;
  pageCount: number;
  pages: NormalizedPage[];
  /** 1-indexed pages that need OCR before the text layer can be trusted. */
  pagesNeedingOcr: number[];
}

export type InspectErrorCode =
  | "not_a_pdf"
  | "too_large"
  | "too_many_pages"
  | "unreadable";

export class InspectError extends Error {
  constructor(
    public readonly code: InspectErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "InspectError";
  }
}
