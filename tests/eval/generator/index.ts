// Usage: npm run eval:generate -- [--count 30] [--seed 1] [--error-rate 0.4] [--out tests/eval/cases]
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateInvoice } from "./invoice";
import { renderPdf } from "./layouts";
import { Rng } from "./rng";

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  const count = Number(arg("count", "30"));
  const seed = Number(arg("seed", "1"));
  const errorRate = Number(arg("error-rate", "0.4"));
  const out = path.resolve(arg("out", "tests/eval/cases"));

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  const rng = new Rng(seed);
  let planted = 0;
  for (let i = 1; i <= count; i++) {
    const g = generateInvoice(rng, i, { errorRate });
    planted += g.expected.plantedErrors.length;
    await writeFile(path.join(out, `${g.expected.id}.pdf`), await renderPdf(g));
    await writeFile(path.join(out, `${g.expected.id}.expected.json`), JSON.stringify(g.expected, null, 2));
  }
  console.log(`Wrote ${count} invoices (${planted} with a planted error) to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
