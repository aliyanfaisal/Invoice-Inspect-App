You are the lead engineer, product architect, UI/UX designer, security engineer, and technical product manager for this project.

We are building a production-quality SaaS web application called:

"Invoice Second Opinion"

Working tagline:

"Before you pay an invoice, get a second opinion."

IMPORTANT:
We are NOT building a generic PDF parser.
We are NOT building a generic AI invoice chatbot.
We are NOT building a simple invoice checklist.
We are NOT building a legal/accounting advice product.

We are building a document verification product that analyzes invoices, detects mathematical/data inconsistencies, identifies missing or suspicious information, and eventually compares invoices against purchase orders, quotes, and historical invoices.

The core product philosophy is:

EXTRACT → VERIFY → EXPLAIN → SHOW EVIDENCE

The user should never have to blindly trust an AI-generated answer.

Every important finding should be backed by evidence from the original document whenever technically possible.

==================================================
1. PRODUCT VISION
==================================================

The user uploads a PDF invoice.

The application should:

1. Inspect the PDF.
2. Determine whether it is text-based, scanned, image-based, or mixed.
3. Extract structured information.
4. Detect invoice fields.
5. Extract line items and tables.
6. Run deterministic verification rules.
7. Identify errors, warnings, and verified fields.
8. Show exactly why something was flagged.
9. Link findings back to the relevant PDF page/region where possible.
10. Eventually use AI only for ambiguous reasoning, anomaly explanation, and higher-level analysis.

The fundamental distinction is:

PDF Inspector = extraction/evidence layer
Our code = verification layer
AI = reasoning/explanation layer

Do NOT make an LLM responsible for basic arithmetic or deterministic validation.

==================================================
2. CORE PRODUCT PRINCIPLES
==================================================

Principle #1:
Trust over magic.

Do not simply say:

"AI found an error."

Instead say:

"Invoice total is €1,428.
Expected total based on extracted line items and 19% VAT is €1,390.
Difference: €38.
Evidence: Page 2."

Principle #2:
Deterministic checks first.

If:
10 × €50 = €500

our code should verify that.

Do NOT ask an LLM whether 10 × 50 = 500.

Principle #3:
Distinguish "not found" from "invalid".

Bad:
"VAT ID is invalid."

Better:
"VAT ID was not detected."

If we cannot confidently determine validity, say so.

Principle #4:
Never fabricate evidence.

If the system cannot locate supporting evidence, it must explicitly say:

"Could not verify."

Principle #5:
Every finding has a reason.

Every finding should eventually contain:

- category
- severity
- title
- explanation
- expected value
- actual value
- difference where relevant
- page number
- source/evidence
- confidence
- rule that produced the finding

Principle #6:
Privacy first.

Invoices contain sensitive financial/business information.

Do not permanently store uploaded PDFs unless the user has explicitly chosen an account/history feature.

For anonymous MVP usage, process the document and delete temporary files/results after a reasonable short retention period.

Never log raw invoice contents in application logs.

==================================================
3. TECHNOLOGY STACK
==================================================

Use this stack unless there is a compelling technical reason to change it.

Frontend:
- Next.js
- TypeScript
- App Router
- React
- Tailwind CSS
- shadcn/ui
- Lucide icons

Backend:
- Next.js server-side functionality / Route Handlers
- TypeScript

PDF processing:
- @firecrawl/pdf-inspector
- Prefer server-side Node integration initially
- Investigate browser WASM later if it materially improves privacy/performance

Database:
- PostgreSQL

Storage:
- Local server storage (must be compatible with standard hosting like cPanel)

Authentication:
- NextAuth.js (Auth.js) or similar independent auth system

Validation:
- Our own deterministic TypeScript rule engine

AI:
- Do NOT add an AI provider during the first milestones.
- Create a clean abstraction so an AI provider can be added later.
- AI should never be hard-coded throughout the application.

Deployment target:
- Must be independent and capable of being hosted anywhere (e.g., standard VPS, cPanel).

Testing:
- Vitest or Jest for unit tests
- Playwright for critical end-to-end flows
- TypeScript strict mode

Package manager:
- npm unless the existing repository already uses another package manager.

==================================================
4. IMPORTANT PDF INSPECTOR REQUIREMENT
==================================================

Use the official @firecrawl/pdf-inspector package.

Before implementing integration, inspect its current API and installed version.

Do NOT guess its API.

Read its documentation/package definitions/source if necessary.

We specifically want to take advantage of:

- PDF classification
- text extraction
- positioned text
- tables
- reading order
- page information
- Markdown/structured extraction
- OCR routing information where available

The application should preserve enough source metadata to map extracted information back to:

- page
- bounding box / coordinates where available
- source text

Do not throw away this metadata.

This evidence layer is one of the product's key differentiators.

==================================================
5. PRODUCT SCOPE
==================================================

The product will eventually have these layers:

PHASE A:
Basic invoice upload and inspection

PHASE B:
Structured invoice extraction

PHASE C:
Deterministic invoice verification

PHASE D:
Evidence viewer

PHASE E:
Better invoice field detection

PHASE F:
Cross-document comparison

PHASE G:
Historical anomaly detection

PHASE H:
Optional AI reasoning

PHASE I:
Accounts, history, limits and billing

PHASE J:
API

We will implement these one milestone at a time.

==================================================
6. MVP VERIFICATION RULES
==================================================

The first verification engine should eventually support:

IDENTITY / REQUIRED FIELDS

- invoice number
- invoice date
- supplier name
- supplier address
- recipient/customer name
- recipient address
- tax/VAT ID where detectable
- currency
- payment terms

LINE ITEMS

- description
- quantity
- unit price
- line total
- tax rate where available

MATHEMATICAL CHECKS

- quantity × unit price = line total
- sum(line totals) = subtotal
- discount calculations
- tax calculation
- subtotal + tax - discount = total
- rounding discrepancies
- currency consistency

DOCUMENT CONSISTENCY

- invoice total exists
- subtotal exists when expected
- tax amount matches displayed rate when possible
- duplicate invoice number detection once history exists
- suspicious dates
- missing required information

Do NOT implement every rule immediately.

Build the architecture so rules can be added independently.

==================================================
7. RESULT MODEL
==================================================

Create a strongly typed internal finding model similar to:

Finding:

- id
- type
- category
- severity
- title
- description
- expectedValue
- actualValue
- difference
- currency
- confidence
- page
- boundingBox if available
- evidenceText
- ruleId
- status

Severity should support:

- verified
- warning
- error
- unable_to_verify

Do not use only true/false.

Example:

VERIFIED:
"Line item total verified."

ERROR:
"Line item total differs from quantity × unit price."

WARNING:
"VAT ID was not detected."

UNABLE_TO_VERIFY:
"The PDF structure did not contain enough information to verify the tax calculation."

==================================================
8. UI/UX DIRECTION
==================================================

The UI should feel like a serious financial/productivity tool.

Avoid:
- gimmicky AI graphics
- excessive gradients
- fake AI animations
- chatbot-first interface
- clutter
- unnecessary dashboards in the MVP

Think:
Linear + Stripe + modern developer SaaS.

Dark/light theme should be considered, but prioritize a polished light theme initially unless the existing project has another direction.

Main flow:

LANDING PAGE

Headline:

"Before you pay an invoice, get a second opinion."

Subheadline:

"Check invoice calculations, missing information, and inconsistencies — with evidence from the original PDF."

CTA:

"Check an invoice"

Secondary CTA:

"See how it works"

Then:

Upload invoice

↓

Analyzing

↓

Results

Results should prominently show:

- Overall status
- Number of errors
- Number of warnings
- Number of verified checks
- Potential monetary discrepancy where applicable

Example:

---------------------------------
INVOICE REVIEW
---------------------------------

🔴 2 errors
🟡 1 warning
🟢 14 verified

Potential discrepancy:
€300.00

---------------------------------

Then findings.

Example:

🔴 LINE ITEM CALCULATION

Consulting
5 × €400 = €2,000

Invoice says:
€2,300

Difference:
€300

Page 2

[View evidence]

---------------------------------

The user should be able to understand the result without reading a long AI-generated paragraph.

==================================================
9. EVIDENCE VIEWER
==================================================

This is an important differentiator.

Eventually the user should be able to click:

"View evidence"

and see the relevant PDF page.

If coordinates are available, highlight the relevant region.

The architecture should support this from the beginning even if the first milestone only shows:

Page 2
Evidence text:
"Consulting 5 €400 €2,300"

Do NOT build an elaborate PDF annotation system in the first milestone unless necessary.

Build the data model correctly first.

==================================================
10. AI ARCHITECTURE
==================================================

DO NOT add AI in the first milestone.

Create an abstraction such as:

interface ReasoningProvider {
  analyze(...)
}

The deterministic engine must work without it.

Later, AI may be used for:

- explaining findings
- detecting semantic inconsistencies
- comparing invoice descriptions with purchase orders
- detecting unusual descriptions
- historical anomaly explanations
- summarizing review results

AI must receive structured extracted data whenever possible rather than the raw PDF.

Never allow an AI model to silently override deterministic validation.

==================================================
11. SECURITY
==================================================

Treat uploaded invoices as sensitive.

Requirements:

- validate file type
- validate file size
- reject unsupported files
- do not trust filename extensions
- avoid arbitrary file execution
- sanitize all displayed extracted text
- never expose server filesystem paths
- never expose API secrets client-side
- never log invoice contents
- implement rate limiting before public launch
- implement deletion/retention policy
- implement robust application-level access control when user data is introduced
- do not store permanent files for anonymous users unless explicitly required

Do not implement payment information handling yet.

==================================================
12. SEO
==================================================

SEO matters, but it must not compromise the product.

Eventually create useful pages such as:

/invoice-checker
/invoice-validator
/invoice-calculator
/invoice-total-checker
/invoice-tax-calculator

But do NOT generate thin SEO pages just for keywords.

Each page should solve a real problem.

The main product page should target the core intent:

"invoice checker"

==================================================
13. ANALYTICS
==================================================

Do not add a huge analytics system immediately.

Eventually track anonymous product events such as:

- upload_started
- upload_completed
- analysis_completed
- finding_viewed
- evidence_opened
- report_downloaded

Never store raw invoice contents in analytics.

==================================================
14. ARCHITECTURE
==================================================

Use clean separation:

/app
/components
/lib
  /pdf
  /invoice
  /validation
  /evidence
  /ai
  /auth
  /storage
/types
/tests

Potential architecture:

PDF ingestion
      ↓
PDF inspection
      ↓
Document normalization
      ↓
Invoice extraction
      ↓
Validation engine
      ↓
Finding aggregation
      ↓
UI

Keep the validation engine independent from React.

Example:

validateInvoice(invoiceData)

should be callable from unit tests without a browser.

==================================================
15. VALIDATION ENGINE DESIGN
==================================================

Do not write 50 giant if-statements in one file.

Create independent rules.

For example:

rules/
  invoice-number.ts
  invoice-date.ts
  line-item-total.ts
  subtotal.ts
  tax.ts
  grand-total.ts
  currency.ts
  supplier.ts
  recipient.ts

Each rule should have a predictable interface.

For example conceptually:

InvoiceRule {
  id
  name
  description
  run(invoice): Finding[]
}

Do not blindly copy this interface if a better design emerges, but preserve the principle:

RULES SHOULD BE MODULAR, TESTABLE, AND INDEPENDENT.

==================================================
16. ERROR HANDLING
==================================================

The application must never fail with a generic:

"Something went wrong."

Give useful states:

- Invalid PDF
- PDF too large
- Scanned PDF
- Mixed PDF
- Text extraction failed
- Invoice could not be detected
- Invoice detected but insufficient data
- Calculation could not be verified

If the system cannot verify something:

say so.

Do not invent an answer.

==================================================
17. PRODUCT LANGUAGE
==================================================

Avoid claims like:

"100% accurate"

"guaranteed"

"legally compliant"

"AI knows whether your invoice is valid"

Instead:

"Check"

"Verify"

"Potential issue"

"Could not verify"

"Detected"

"Evidence"

"Review recommended"

This is a financial document product, so accuracy and wording matter.

==================================================
18. MILESTONE DEVELOPMENT RULE
==================================================

THIS IS CRITICAL.

DO NOT BUILD THE ENTIRE PRODUCT AT ONCE.

We will work milestone by milestone.

For each milestone:

1. Inspect the current repository.
2. Understand what already exists.
3. State briefly what you are going to implement.
4. Implement ONLY that milestone.
5. Run tests.
6. Run type checking.
7. Run linting.
8. Manually verify the application where possible.
9. Fix issues.
10. Summarize what changed.
11. Tell me exactly how to test it.
12. STOP.

DO NOT automatically continue to the next milestone.

Wait for my explicit instruction:

"Continue to Milestone X"

before proceeding.

Do not prematurely build authentication, billing, AI, dashboards, history, APIs, or advanced OCR.

==================================================
19. MILESTONES
==================================================

MILESTONE 0 — PROJECT AUDIT

Before writing meaningful code:

- inspect repository
- inspect existing package.json
- inspect existing files
- inspect current framework
- inspect existing dependencies
- inspect environment variables
- inspect whether this is an existing project or blank project
- inspect whether pdf-inspector is already installed
- inspect available scripts

Do not make large changes.

Deliver:

- current architecture summary
- recommended architecture
- dependency recommendations
- risks
- exact plan for Milestone 1

STOP.

--------------------------------------------------

MILESTONE 1 — PRODUCT SHELL

Build:

- polished landing page
- application shell
- navigation
- invoice upload interface
- drag/drop
- PDF file validation
- basic loading state
- responsive design
- no real invoice analysis yet

Use a mock analysis result only for UI development if necessary.

The UI should already feel like a real product.

STOP.

--------------------------------------------------

MILESTONE 2 — PDF INSPECTION

Integrate:

@firecrawl/pdf-inspector

Implement:

- PDF classification
- text extraction
- page information
- table extraction where available
- positioned text metadata where available

Create an internal normalized document representation.

Display a developer/debug view if useful.

Do not build invoice verification yet.

Test with several PDF types.

STOP.

--------------------------------------------------

MILESTONE 3 — INVOICE EXTRACTION

Build the first invoice extraction layer.

Extract where possible:

- invoice number
- date
- supplier
- recipient
- currency
- subtotal
- tax
- total
- payment terms
- line items
- quantity
- unit price
- line total
- tax rate

Do not use AI yet.

Use deterministic parsing and heuristics.

Every extracted field should retain source evidence when possible.

Create test fixtures from synthetic invoices.

STOP.

--------------------------------------------------

MILESTONE 4 — DETERMINISTIC VERIFICATION ENGINE

Build the modular rule engine.

Implement the first core checks:

- quantity × unit price
- line total
- subtotal
- tax
- total
- currency consistency
- required fields
- missing information

Produce structured findings.

Do not add AI.

Write comprehensive unit tests.

STOP.

--------------------------------------------------

MILESTONE 5 — RESULTS UI

Replace the mock results with real analysis.

Build:

- overall status
- verified/error/warning counts
- monetary discrepancy
- finding cards
- severity
- expected vs actual
- explanation
- page number
- evidence text

Make the results immediately understandable.

STOP.

--------------------------------------------------

MILESTONE 6 — PDF EVIDENCE

Implement:

- PDF page viewer
- page navigation
- "View evidence"
- source text
- coordinate-based highlighting if feasible

The user should be able to understand why the application produced each finding.

STOP.

--------------------------------------------------

MILESTONE 7 — ROBUSTNESS

Test against many invoice layouts.

Create a test corpus of synthetic invoices covering:

- normal invoice
- wrong line total
- wrong subtotal
- wrong tax
- wrong grand total
- missing VAT ID
- missing address
- multiple pages
- multiple tables
- different currencies
- decimal/rounding differences
- unusual formatting
- multi-column layouts

Improve extraction and validation.

Do not use AI unless absolutely necessary.

STOP.

--------------------------------------------------

MILESTONE 8 — SCANNED PDF/OCR ROUTING

Add support for scanned/mixed PDFs.

Use pdf-inspector's classification to determine when OCR is necessary.

Choose the simplest reliable OCR implementation.

Do not unnecessarily add expensive cloud AI.

Clearly indicate when OCR is being used.

STOP.

--------------------------------------------------

MILESTONE 9 — CROSS-DOCUMENT CHECKING

Allow users to upload:

- invoice
- purchase order
- quote

Compare:

- totals
- line items
- quantities
- prices
- descriptions

Show:

"Invoice exceeds PO by €X"

with evidence from both documents.

STOP.

--------------------------------------------------

MILESTONE 10 — HISTORY / DUPLICATES

Add accounts.

Use NextAuth.js (Auth.js) or a comparable independent authentication system.

Store structured invoice metadata.

Do NOT permanently store PDFs unless required. Ensure PDF storage relies on local server storage so the application can be hosted on standard providers like cPanel.

Implement:

- invoice history
- duplicate invoice number detection
- duplicate vendor/date/amount detection
- previous invoice comparison

Implement proper application-level access control to ensure users can only access their own data.

STOP.

--------------------------------------------------

MILESTONE 11 — AI REASONING

ONLY NOW add an AI provider.

Create a provider abstraction.

AI features:

- semantic inconsistency detection
- unusual invoice explanation
- PO vs invoice description comparison
- anomaly explanation
- natural language summary

AI must never fabricate evidence.

All AI findings must reference structured evidence.

STOP.

--------------------------------------------------

MILESTONE 12 — PRODUCTIZATION

Add:

- usage limits
- anonymous free usage
- accounts
- pricing
- Stripe or another standard payment provider
- billing
- usage dashboard
- report download

Do not add this before the core product is proven.

STOP.

--------------------------------------------------

MILESTONE 13 — SEO / GROWTH

Build high-quality SEO pages.

Examples:

/invoice-checker
/invoice-validator
/invoice-total-checker
/invoice-tax-calculator
/invoice-calculation-checker

Each page must have unique useful content and a working tool where appropriate.

Add:

- metadata
- sitemap
- robots.txt
- structured data where appropriate
- Open Graph
- fast loading

STOP.

--------------------------------------------------

MILESTONE 14 — API

Eventually expose the verification engine as an API.

Example conceptual request:

POST /api/v1/invoices/check

Response:

{
  "status": "review",
  "findings": [],
  "verified": [],
  "warnings": []
}

Design API authentication, rate limits and billing carefully.

STOP.

==================================================
20. WHAT NOT TO BUILD YET
==================================================

Until explicitly requested, DO NOT build:

- billing
- Stripe
- subscriptions
- user accounts
- admin dashboard
- complex analytics
- AI chatbot
- invoice generation
- accounting integrations
- QuickBooks integration
- Xero integration
- email automation
- Slack integration
- mobile app
- browser extension
- API
- advanced OCR
- multi-country compliance engine

We are validating the core product first.

==================================================
21. TESTING REQUIREMENTS
==================================================

Every verification rule needs tests.

For example:

Input:

quantity = 10
unitPrice = 50
lineTotal = 500

Expected:
VERIFIED

Input:

quantity = 10
unitPrice = 50
lineTotal = 550

Expected:
ERROR
difference = 50

Also test:

- decimal values
- currency rounding
- negative values
- missing values
- malformed values
- European decimal formats
- thousands separators
- currencies
- multiple pages

Never assume one invoice layout.

==================================================
22. PERFORMANCE
==================================================

PDF processing should be efficient.

Do not send PDFs to an LLM unnecessarily.

Use pdf-inspector locally wherever possible.

Avoid loading huge PDFs into the browser unnecessarily.

Avoid unnecessary database writes.

Keep the first analysis pipeline fast.

Display progress states such as:

1. Reading PDF
2. Inspecting document
3. Extracting invoice data
4. Checking calculations
5. Preparing results

Do not fake progress.

==================================================
23. DESIGN GOAL
==================================================

The product should feel like a serious financial verification tool.

The core emotional reaction should be:

"Oh, this actually checked my invoice."

NOT:

"Oh, this is another AI PDF wrapper."

Important UI principle:

SHOW THE NUMBERS.

SHOW THE DIFFERENCE.

SHOW THE EVIDENCE.

==================================================
24. FINAL RULE
==================================================

You are an engineering agent working under milestone control.

NEVER assume that because you can implement something, you should implement it now.

Build the smallest useful piece.

Test it.

Make it production-quality.

STOP.

Wait for my next instruction.

Start with MILESTONE 0 ONLY.
