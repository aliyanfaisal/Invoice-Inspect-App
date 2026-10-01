// How a document prints numbers and dates. Mixing these is the point: the same
// "01/11/2026" or "1.234" means different things in different documents.

export interface DocFormat {
  name: string;
  currency: string;
  symbol: string;
  symbolAfter: boolean;
  thousands: string;
  decimal: string;
  date: "MDY/" | "DMY/" | "DMY." | "DMY-text";
  /** Typical tax label and rates for this format. */
  taxLabel: string;
  taxRates: number[];
}

export const FORMATS: DocFormat[] = [
  { name: "us", currency: "USD", symbol: "$", symbolAfter: false, thousands: ",", decimal: ".", date: "MDY/", taxLabel: "Sales tax", taxRates: [0, 6, 8.25] },
  { name: "uk", currency: "GBP", symbol: "£", symbolAfter: false, thousands: ",", decimal: ".", date: "DMY/", taxLabel: "VAT", taxRates: [0, 5, 20] },
  { name: "de", currency: "EUR", symbol: "€", symbolAfter: true, thousands: ".", decimal: ",", date: "DMY.", taxLabel: "MwSt.", taxRates: [7, 19] },
  { name: "fr", currency: "EUR", symbol: "€", symbolAfter: true, thousands: " ", decimal: ",", date: "DMY-text", taxLabel: "TVA", taxRates: [5.5, 10, 20] },
];

export function formatMoney(cents: number, f: DocFormat, withSymbol = true): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, f.thousands);
  const num = `${whole}${f.decimal}${String(abs % 100).padStart(2, "0")}`;
  const signed = negative ? `-${num}` : num;
  if (!withSymbol) return signed;
  return f.symbolAfter ? `${signed} ${f.symbol}` : `${negative ? "-" : ""}${f.symbol}${num}`;
}

export function formatQuantity(q: number, f: DocFormat): string {
  return Number.isInteger(q) ? String(q) : q.toFixed(2).replace(".", f.decimal);
}

const MONTHS_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

export function formatDate(iso: string, f: DocFormat): string {
  const [y, m, d] = iso.split("-");
  switch (f.date) {
    case "MDY/": return `${m}/${d}/${y}`;
    case "DMY/": return `${d}/${m}/${y}`;
    case "DMY.": return `${d}.${m}.${y}`;
    case "DMY-text": return `${Number(d)} ${MONTHS_FR[Number(m) - 1]} ${y}`;
  }
}
