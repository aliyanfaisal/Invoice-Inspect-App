import { describe, expect, it } from "vitest";
import { inspectPdf } from "@/lib/pdf/inspect";
import { InspectError } from "@/lib/pdf/types";
import { makePdf } from "./make-pdf";

describe("inspectPdf", () => {
  it("extracts positioned text from a text-based PDF", async () => {
    const pdf = makePdf([
      { x: 72, y: 760, text: "Invoice INV-1001" },
      { x: 72, y: 700, text: "Consulting 5 400.00 2000.00" },
      { x: 400, y: 600, text: "Total 2000.00" },
    ]);
    const doc = await inspectPdf(pdf);

    expect(doc.kind).toBe("text");
    expect(doc.pageCount).toBe(1);
    expect(doc.pages[0].page).toBe(1);
    const all = doc.pages[0].items.map((i) => i.text).join(" ");
    expect(all).toContain("INV-1001");
    expect(all).toContain("2000.00");
    const total = doc.pages[0].items.find((i) => i.text.includes("Total"));
    expect(total?.bbox.x).toBeCloseTo(400, 0);
  });

  it("rejects non-PDF bytes", async () => {
    await expect(inspectPdf(Buffer.from("hello world"))).rejects.toMatchObject({
      code: "not_a_pdf",
    });
  });

  it("rejects oversized files", async () => {
    const big = Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(10 * 1024 * 1024)]);
    await expect(inspectPdf(big)).rejects.toBeInstanceOf(InspectError);
  });

  it("reports unreadable PDFs without leaking parser messages", async () => {
    const err = await inspectPdf(Buffer.from("%PDF-1.4\ngarbage")).catch((e) => e);
    expect(err).toBeInstanceOf(InspectError);
    expect(err.code).toBe("unreadable");
  });
});
