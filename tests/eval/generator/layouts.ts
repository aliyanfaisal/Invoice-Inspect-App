import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatDate, formatMoney, formatQuantity } from "./formats";
import type { GeneratedInvoice } from "./invoice";

const W = 595;
const H = 842;
const MARGIN = 50;
const INK = rgb(0.1, 0.1, 0.12);
const GREY = rgb(0.4, 0.4, 0.45);

interface Ctx {
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  g: GeneratedInvoice;
}

function text(c: Ctx, s: string, x: number, y: number, o: { size?: number; bold?: boolean; grey?: boolean; right?: boolean } = {}) {
  const font = o.bold ? c.bold : c.font;
  const size = o.size ?? 10;
  const w = font.widthOfTextAtSize(s, size);
  c.page.drawText(s, { x: o.right ? x - w : x, y: H - y, size, font, color: o.grey ? GREY : INK });
}

function rule(c: Ctx, y: number, x1 = MARGIN, x2 = W - MARGIN) {
  c.page.drawLine({ start: { x: x1, y: H - y }, end: { x: x2, y: H - y }, thickness: 0.6, color: GREY });
}

const money = (c: Ctx, cents: number, symbol = true) => formatMoney(cents, c.g.format, symbol);

/** Line table. `headers` false gives a table with no column titles. */
function drawLines(c: Ctx, top: number, headers: boolean): number {
  const { expected: e } = c.g;
  const cols = { desc: MARGIN, qty: 340, unit: 440, amount: W - MARGIN };
  let y = top;
  if (headers) {
    text(c, "Description", cols.desc, y, { bold: true });
    text(c, "Qty", cols.qty, y, { bold: true, right: true });
    text(c, "Unit price", cols.unit, y, { bold: true, right: true });
    text(c, "Amount", cols.amount, y, { bold: true, right: true });
    rule(c, y + 6);
    y += 22;
  }
  for (const l of e.lines) {
    text(c, l.description, cols.desc, y);
    text(c, formatQuantity(l.quantity, c.g.format), cols.qty, y, { right: true });
    text(c, money(c, l.unitPriceCents, false), cols.unit, y, { right: true });
    text(c, money(c, l.amountCents, false), cols.amount, y, { right: true });
    y += 18;
  }
  rule(c, y - 6);
  return y + 12;
}

function totalsRows(c: Ctx, labels: Record<string, string | null>): [string | null, number, boolean][] {
  const { expected: e, format: f } = c.g;
  const rows: [string | null, number, boolean][] = [[labels.subtotal, e.subtotalCents, false]];
  if (e.discountCents) rows.push([labels.discount, -e.discountCents, false]);
  if (e.shippingCents) rows.push([labels.shipping, e.shippingCents, false]);
  if (e.taxRatePercent > 0) {
    const rate = String(e.taxRatePercent).replace(".", f.decimal);
    rows.push([labels.tax === null ? null : `${labels.tax} (${rate}%)`, e.taxCents, false]);
  }
  rows.push([labels.total, e.totalCents, true]);
  return rows;
}

function drawTotals(c: Ctx, top: number, labels: Record<string, string | null>): void {
  let y = top;
  for (const [label, cents, strong] of totalsRows(c, labels)) {
    if (label) text(c, label, 380, y, { bold: strong, grey: !strong });
    text(c, money(c, cents), W - MARGIN, y, { bold: strong, right: true });
    y += 18;
  }
}

function drawParties(c: Ctx, top: number): void {
  const { expected: e, supplierAddress, customerAddress } = c.g;
  text(c, e.supplier.name, MARGIN, top, { bold: true, size: 14 });
  text(c, supplierAddress, MARGIN, top + 16, { grey: true });
  if (e.supplier.vatId) text(c, `${c.g.format.taxLabel} ID: ${e.supplier.vatId}`, MARGIN, top + 30, { grey: true });
  text(c, "Bill to", MARGIN, top + 70, { grey: true, size: 9 });
  text(c, e.customer.name, MARGIN, top + 84, { bold: true });
  text(c, customerAddress, MARGIN, top + 98, { grey: true });
}

const LAYOUT_DRAW: Record<string, (c: Ctx) => void> = {
  // Labelled everything: the easy case.
  classic(c) {
    const { expected: e, format: f } = c.g;
    drawParties(c, 70);
    text(c, "INVOICE", W - MARGIN, 70, { bold: true, size: 22, right: true });
    text(c, `Invoice no: ${e.invoiceNumber}`, W - MARGIN, 96, { right: true });
    text(c, `Date: ${formatDate(e.issueDate, f)}`, W - MARGIN, 110, { right: true });
    text(c, `Due date: ${formatDate(e.dueDate, f)}`, W - MARGIN, 124, { right: true });
    const y = drawLines(c, 240, true);
    drawTotals(c, y + 10, { subtotal: "Subtotal", discount: "Discount", shipping: "Shipping", tax: f.taxLabel, total: "Total due" });
  },
  // Metadata in a boxed side column, different wording.
  sidebar(c) {
    const { expected: e, format: f } = c.g;
    drawParties(c, 70);
    c.page.drawRectangle({ x: 380, y: H - 150, width: 165, height: 90, borderColor: GREY, borderWidth: 0.6 });
    text(c, "Reference", 390, 80, { grey: true, size: 8 });
    text(c, e.invoiceNumber, 390, 92, { bold: true });
    text(c, "Issued", 390, 108, { grey: true, size: 8 });
    text(c, formatDate(e.issueDate, f), 390, 120);
    text(c, "Payable by", 460, 108, { grey: true, size: 8 });
    text(c, formatDate(e.dueDate, f), 460, 120);
    const y = drawLines(c, 250, true);
    drawTotals(c, y + 10, { subtotal: "Net", discount: "Less discount", shipping: "Delivery", tax: f.taxLabel, total: "Gross total" });
  },
  // No column headers and no labels on the totals except the last one.
  bare(c) {
    const { expected: e, format: f } = c.g;
    drawParties(c, 70);
    text(c, e.invoiceNumber, W - MARGIN, 76, { bold: true, size: 16, right: true });
    text(c, formatDate(e.issueDate, f), W - MARGIN, 96, { right: true });
    text(c, `by ${formatDate(e.dueDate, f)}`, W - MARGIN, 110, { right: true });
    const y = drawLines(c, 240, false);
    drawTotals(c, y + 10, { subtotal: null, discount: null, shipping: null, tax: null, total: "Amount due" });
  },
};

export async function renderPdf(g: GeneratedInvoice): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([W, H]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  LAYOUT_DRAW[g.layout]({ page, font, bold, g });
  return doc.save();
}
