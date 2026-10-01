import type { ExpectedInvoice, ExpectedLine, PlantedError, PlantedRule } from "../types";
import { FORMATS, type DocFormat } from "./formats";
import type { Rng } from "./rng";

export const LAYOUTS = ["classic", "sidebar", "bare"] as const;
export type LayoutName = (typeof LAYOUTS)[number];

export interface GeneratedInvoice {
  expected: ExpectedInvoice;
  format: DocFormat;
  layout: LayoutName;
  supplierAddress: string;
  customerAddress: string;
}

// [name, address, format]. Parties are matched to the document format so
// addresses, currency and number style agree.
const SUPPLIERS = [
  ["Harbour & Finch Consulting", "12 Quay Road, Leeds LS1 4AB", "uk"],
  ["Northwind Print Works", "88 Mill Lane, Manchester M4 2FD", "uk"],
  ["Tamsin Okafor Design", "3 Elm Court, Bristol BS1 5TT", "uk"],
  ["Brightfield Logistics GmbH", "Hafenstrasse 41, 20457 Hamburg", "de"],
  ["Rhein Druck KG", "Kaiserstrasse 17, 50674 Köln", "de"],
  ["Atelier Moreau SARL", "7 rue des Lilas, 69003 Lyon", "fr"],
  ["Studio Bernard SAS", "22 quai Saint-Antoine, 69002 Lyon", "fr"],
  ["Cedar Point Software Inc.", "400 Pine Street, Austin, TX 78701", "us"],
  ["Bluebird Freight LLC", "1200 Harbor Blvd, Seattle, WA 98101", "us"],
] as const;
const CUSTOMERS = [
  ["Larkspur Dental Group", "21 Orchard Way, Reading RG1 2PL", "uk"],
  ["Meridian Foods Ltd", "5 Dock Street, Glasgow G2 8QQ", "uk"],
  ["Weidemann Bau AG", "Lindenallee 9, 80331 München", "de"],
  ["Nordlicht Verlag GmbH", "Elbchaussee 120, 22763 Hamburg", "de"],
  ["Maison Duval SAS", "14 avenue Foch, 75116 Paris", "fr"],
  ["Kestrel Analytics", "950 Market Street, San Francisco, CA 94102", "us"],
  ["Prairie Wind Co-op", "88 Main Street, Omaha, NE 68102", "us"],
] as const;
const ITEMS = [
  ["Consulting services (hours)", 7500, 18000, true],
  ["Website maintenance, monthly", 25000, 90000, false],
  ["Print run, A4 brochures", 12000, 60000, false],
  ["Freight, pallet", 8000, 24000, false],
  ["Software licence, annual", 30000, 250000, false],
  ["Design revision", 4500, 16000, true],
  ["Hosting, per month", 1500, 9000, false],
  ["Travel expenses", 2000, 45000, false],
  ["Training workshop, day", 60000, 150000, false],
] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

export interface GenerateOptions {
  /** Chance the invoice carries one planted error. */
  errorRate: number;
}

export function generateInvoice(rng: Rng, index: number, opts: GenerateOptions): GeneratedInvoice {
  const format = rng.pick(FORMATS);
  const layout = rng.pick(LAYOUTS);
  const [supplierName, supplierAddress] = rng.pick(SUPPLIERS.filter((p) => p[2] === format.name));
  const [customerName, customerAddress] = rng.pick(CUSTOMERS.filter((p) => p[2] === format.name));

  const lines: ExpectedLine[] = Array.from({ length: rng.int(1, 8) }, () => {
    const [description, min, max, fractional] = rng.pick(ITEMS);
    const quantity = fractional ? rng.int(1, 30) / 2 : rng.int(1, 12);
    const unitPriceCents = Math.round(rng.int(min, max) / 5) * 5;
    return { description, quantity, unitPriceCents, amountCents: Math.round(quantity * unitPriceCents) };
  });

  const subtotalCents = lines.reduce((s, l) => s + l.amountCents, 0);
  const discountCents = rng.chance(0.25) ? Math.round(subtotalCents * rng.pick([0.05, 0.1]) ) : 0;
  const shippingCents = rng.chance(0.3) ? rng.int(500, 4500) : 0;
  const taxRatePercent = rng.pick(format.taxRates);
  const taxCents = Math.round(((subtotalCents - discountCents) * taxRatePercent) / 100);
  const totalCents = subtotalCents - discountCents + taxCents + shippingCents;

  const year = 2026;
  const issueMonth = rng.int(1, 11);
  const issueDay = rng.int(1, 28);
  const termMonth = issueMonth + 1;

  const expected: ExpectedInvoice = {
    id: `invoice-${String(index).padStart(3, "0")}`,
    layout,
    currency: format.currency,
    supplier: { name: supplierName, vatId: taxRatePercent > 0 || format.name !== "us" ? vatId(rng, format) : null },
    customer: { name: customerName },
    invoiceNumber: `${rng.pick(["INV", "RE", "F", "2026"])}-${rng.int(1000, 9999)}`,
    issueDate: iso(year, issueMonth, issueDay),
    dueDate: iso(year, termMonth, issueDay),
    lines,
    subtotalCents,
    discountCents,
    shippingCents,
    taxRatePercent,
    taxCents,
    totalCents,
    plantedErrors: [],
  };

  if (rng.chance(opts.errorRate)) plantError(rng, expected);

  return { expected, format, layout, supplierAddress, customerAddress };
}

function vatId(rng: Rng, f: DocFormat): string {
  const digits = (n: number) => Array.from({ length: n }, () => rng.int(0, 9)).join("");
  switch (f.name) {
    case "uk": return `GB${digits(9)}`;
    case "de": return `DE${digits(9)}`;
    case "fr": return `FR${rng.int(10, 99)}${digits(9)}`;
    default: return `EIN ${digits(2)}-${digits(7)}`;
  }
}

/** Alters what the document PRINTS and records the mistake in plantedErrors. */
function plantError(rng: Rng, inv: ExpectedInvoice): void {
  const rules: PlantedRule[] = ["line_total_mismatch", "subtotal_mismatch", "tax_mismatch", "grand_total_mismatch"];
  if (inv.supplier.vatId) rules.push("missing_vat_id");
  const rule = rng.pick(rules);
  const bump = () => rng.pick([-1, 1]) * rng.pick([500, 1000, 2500, 5000, 30000]);
  const record = (e: PlantedError) => inv.plantedErrors.push(e);

  switch (rule) {
    case "line_total_mismatch": {
      const i = rng.int(0, inv.lines.length - 1);
      const correct = inv.lines[i].amountCents;
      inv.lines[i].amountCents = Math.max(100, correct + bump());
      record({ rule, line: i, correctCents: correct, printedCents: inv.lines[i].amountCents });
      // The printed subtotal and total keep following the true line values, so
      // this is a single, isolated error.
      break;
    }
    case "subtotal_mismatch": {
      const correct = inv.subtotalCents;
      inv.subtotalCents = Math.max(100, correct + bump());
      record({ rule, correctCents: correct, printedCents: inv.subtotalCents });
      break;
    }
    case "tax_mismatch": {
      if (inv.taxRatePercent === 0) return plantError(rng, inv);
      const correct = inv.taxCents;
      inv.taxCents = Math.max(1, correct + bump());
      record({ rule, correctCents: correct, printedCents: inv.taxCents });
      break;
    }
    case "grand_total_mismatch": {
      const correct = inv.totalCents;
      inv.totalCents = Math.max(100, correct + bump());
      record({ rule, correctCents: correct, printedCents: inv.totalCents });
      break;
    }
    case "missing_vat_id":
      inv.supplier.vatId = null;
      record({ rule });
      break;
  }
}
