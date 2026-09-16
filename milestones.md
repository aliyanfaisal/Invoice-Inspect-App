# InvoiceInspect Milestones

## Basic Details
- **Name:** InvoiceInspect
- **Domain:** InvoiceInspect.app
- **Tagline:** Find invoice errors before you pay.
- **Supporting message:** Check the numbers. Catch inconsistencies. See the evidence.

## Milestones

- [x] **MILESTONE 0 — PROJECT AUDIT**
  - Inspect repository and environment, summarize architecture, and plan Milestone 1.

- [x] **MILESTONE 1 — PRODUCT SHELL**
  - Build landing page, app shell, navigation, invoice upload UI, and basic loading state. 

- [ ] **MILESTONE 2 — PDF INSPECTION**
  - Integrate `@firecrawl/pdf-inspector`, extract text/tables, and create internal normalized document representation.

- [ ] **MILESTONE 3 — INVOICE EXTRACTION**
  - Deterministic parsing and heuristics to extract invoice fields (number, date, supplier, line items, etc.) while retaining source evidence.

- [ ] **MILESTONE 4 — DETERMINISTIC VERIFICATION ENGINE**
  - Build modular rule engine for mathematical checks, currency consistency, and required fields.

- [ ] **MILESTONE 5 — RESULTS UI**
  - Build overall status, verified/error/warning counts, and finding cards with expected vs actual values.

- [ ] **MILESTONE 6 — PDF EVIDENCE**
  - Implement PDF page viewer, navigation, and coordinate-based highlighting of source text.

- [ ] **MILESTONE 7 — ROBUSTNESS**
  - Test against a corpus of synthetic invoices with various layouts and errors to improve extraction and validation.

- [ ] **MILESTONE 8 — SCANNED PDF/OCR ROUTING**
  - Add support for scanned/mixed PDFs using simple, reliable OCR based on classification.

- [ ] **MILESTONE 9 — CROSS-DOCUMENT CHECKING**
  - Allow uploading purchase orders/quotes to compare against the invoice.

- [ ] **MILESTONE 10 — HISTORY / DUPLICATES**
  - Add user accounts with NextAuth.js, invoice history, duplicate detection, and robust application-level access control. Local server storage for PDFs.

- [ ] **MILESTONE 11 — AI REASONING**
  - Create AI provider abstraction for anomaly explanation and natural language summary based on structured evidence.

- [ ] **MILESTONE 12 — PRODUCTIZATION**
  - Add usage limits, pricing, payment provider, billing, and report downloading.

- [ ] **MILESTONE 13 — SEO / GROWTH**
  - Build SEO pages (e.g., /invoice-checker, /invoice-validator) targeting real problems with fast loading and structured data.

- [ ] **MILESTONE 14 — API**
  - Expose verification engine as a robust API with authentication and rate limits.
