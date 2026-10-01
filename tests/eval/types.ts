// The answer key written next to every generated PDF.
//
// `expected` is what the document PRINTS, including any planted mistake, because
// that is what the pipeline should extract. `plantedErrors` lists what the
// verification rules should flag. Amounts are integer minor units (cents).

export type PlantedRule =
  | "line_total_mismatch"
  | "subtotal_mismatch"
  | "tax_mismatch"
  | "grand_total_mismatch"
  | "missing_vat_id";

export interface PlantedError {
  rule: PlantedRule;
  /** 0-based line index, for line-level errors. */
  line?: number;
  /** What the document should have said, in cents (absent for missing fields). */
  correctCents?: number;
  printedCents?: number;
}

export interface ExpectedLine {
  description: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
}

export interface ExpectedInvoice {
  id: string;
  layout: string;
  currency: string;
  supplier: { name: string; vatId: string | null };
  customer: { name: string };
  invoiceNumber: string;
  /** ISO dates (YYYY-MM-DD), whatever format the PDF prints them in. */
  issueDate: string;
  dueDate: string;
  lines: ExpectedLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxRatePercent: number;
  taxCents: number;
  totalCents: number;
  plantedErrors: PlantedError[];
}
