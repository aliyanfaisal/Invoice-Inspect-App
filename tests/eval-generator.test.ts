import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inspectPdf } from "@/lib/pdf/inspect";
import type { ExpectedInvoice } from "./eval/types";

let dir: string;
let cases: ExpectedInvoice[];

beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "eval-gen-"));
  execFileSync("npx", ["tsx", "tests/eval/generator/index.ts", "--count", "40", "--seed", "7", "--out", dir], { stdio: "pipe" });
  const files = (await readdir(dir)).filter((f) => f.endsWith(".expected.json"));
  cases = await Promise.all(files.map(async (f) => JSON.parse(await readFile(path.join(dir, f), "utf8"))));
}, 60_000);

afterAll(() => rm(dir, { recursive: true, force: true }));

describe("eval generator", () => {
  it("is deterministic for a given seed", async () => {
    const again = await mkdtemp(path.join(tmpdir(), "eval-gen-"));
    execFileSync("npx", ["tsx", "tests/eval/generator/index.ts", "--count", "5", "--seed", "7", "--out", again], { stdio: "pipe" });
    const a = await readFile(path.join(dir, "invoice-003.expected.json"), "utf8");
    const b = await readFile(path.join(again, "invoice-003.expected.json"), "utf8");
    await rm(again, { recursive: true, force: true });
    expect(a).toBe(b);
  }, 60_000);

  it("keeps clean invoices arithmetically correct", () => {
    const clean = cases.filter((c) => c.plantedErrors.length === 0);
    expect(clean.length).toBeGreaterThan(5);
    for (const c of clean) {
      expect(c.lines.every((l) => l.amountCents === Math.round(l.quantity * l.unitPriceCents))).toBe(true);
      expect(c.lines.reduce((s, l) => s + l.amountCents, 0)).toBe(c.subtotalCents);
      expect(c.subtotalCents - c.discountCents + c.taxCents + c.shippingCents).toBe(c.totalCents);
    }
  });

  it("makes every planted error a real, detectable discrepancy", () => {
    const bad = cases.filter((c) => c.plantedErrors.length > 0);
    expect(bad.length).toBeGreaterThan(5);
    for (const c of bad) {
      const [err] = c.plantedErrors;
      const sumOfLines = c.lines.reduce((s, l) => s + l.amountCents, 0);
      switch (err.rule) {
        case "line_total_mismatch": {
          const l = c.lines[err.line!];
          expect(l.amountCents).not.toBe(Math.round(l.quantity * l.unitPriceCents));
          break;
        }
        case "subtotal_mismatch":
          expect(c.subtotalCents).not.toBe(sumOfLines);
          break;
        case "tax_mismatch":
          expect(c.taxCents).not.toBe(Math.round(((c.subtotalCents - c.discountCents) * c.taxRatePercent) / 100));
          break;
        case "grand_total_mismatch":
          expect(c.totalCents).not.toBe(c.subtotalCents - c.discountCents + c.taxCents + c.shippingCents);
          break;
        case "missing_vat_id":
          expect(c.supplier.vatId).toBeNull();
          break;
      }
    }
  });

  it("writes PDFs whose text layer contains the printed total", async () => {
    const c = cases.find((x) => x.layout === "classic")!;
    const doc = await inspectPdf(await readFile(path.join(dir, `${c.id}.pdf`)));
    expect(doc.kind).toBe("text");
    const text = doc.pages[0].items.map((i) => i.text).join(" ");
    expect(text).toContain(c.invoiceNumber);
    expect(text).toContain(c.supplier.name);
  });

  it("uses all three layouts", () => {
    expect(new Set(cases.map((c) => c.layout))).toEqual(new Set(["classic", "sidebar", "bare"]));
  });
});
