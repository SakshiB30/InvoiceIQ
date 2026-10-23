# InvoiceIQ Bug Report — Initial Audit

**Updated:** 2026-10-23

## BUG-00: Invoice creation accepted server-managed fields from request JSON

- **Severity:** MEDIUM (data integrity; authentication required)
- **Status:** Fixed and after-fix behavior verified with an isolated HTTP request. Pre-fix behavior was found by source inspection, not executed against a database.
- **Evidence:** Before the change, `InvoiceController.createInvoice` passed the request-bound `Invoice` to `InvoiceService.createInvoice`. The service set owner/timestamps but retained ID, processing status, validation, duplicate and source document. `confirmInvoice` trusts stored validation when transitioning an invoice to completed.
- **Impact:** A logged-in user could create an invoice with forged server-managed state, bypassing the intended processing/review state and polluting analytics or document metadata.
- **Correction made:** The controller now constructs a new invoice and copies only vendor, invoice number/date, due date, items, amounts and category. The service still supports its internally processed invoice workflow.
- **Verification:** In a throwaway Mongo database, registered a test user, then submitted forged `id`, `userId`, completion status, passing validation, duplicate state, source-document path and old timestamps. Response returned the authenticated owner, generated ID and current timestamps; submitted server-managed fields were ignored.
- **Regression test required:** Add an automated controller/API test with forged managed fields and assert they cannot override server state.

## BUG-01: Source files may remain after invoice deletion

- **Severity:** LOW (storage lifecycle; severity may change with retention/privacy requirements)
- **Status:** NEEDS REPRODUCTION; source-code path reviewed, not dynamically reproduced.
- **Evidence:** `InvoiceService.deleteInvoice` retrieves the invoice through `findByIdAndUserId` and deletes the MongoDB invoice. It does not call `FileStorageService` or otherwise remove `sourceDocument.storageUrl`. The invoice download route relies on that stored path.
- **Impact:** Repeated deletion of uploaded invoices may leave files in the upload directory, consuming storage and retaining documents after users believe they deleted them.
- **Safe reproduction:** In a disposable test database and temporary upload directory, create one invoice with one generated test file, delete that invoice through the service, and check whether the file remains. Also keep a second unrelated test file and assert it is untouched.
- **Smallest proposed fix:** Coordinate cleanup with the delete lifecycle using the stored document path and the same validated storage-root resolution used for download. Preserve the database row if cleanup semantics require retries; add regression coverage for missing files and unrelated files. Do not implement until the intended deletion/retention contract is confirmed.
- **Regression test:** Test-owned invoice deletion removes its associated test file, while a different invoice's file remains.

## BUG-02: Frontend lint fails on three state synchronization effects

- **Severity:** LOW (maintainability/CI quality)
- **Status:** Reproduced by `npm run lint`.
- **Evidence:** ESLint reports `react-hooks/set-state-in-effect` at `src/components/expenses/ExpenseFilters.jsx:102`, `src/components/invoices/InvoiceDetails.jsx:99`, and `src/components/settings/ProfileSettings.jsx:23`.
- **Impact:** The repository's declared lint command exits nonzero, so lint cannot currently serve as a clean quality gate.
- **Smallest proposed fix:** Refactor each derived/form state flow using controlled inputs, keyed initialization, or an effect callback appropriate to the component behavior; add focused component tests if introducing them.
- **Regression test:** `npm run lint` exits 0 and affected component state still follows the selected invoice/filter/profile.

## BUG-03: Frontend main bundle exceeds Vite's advisory chunk size

- **Severity:** INFORMATIONAL / performance follow-up
- **Status:** Reproduced as a build warning, not a functional failure.
- **Evidence:** `npm run build` emitted an 832.80 kB minified JS chunk and the Vite warning threshold is 500 kB.
- **Impact:** Initial download/parse may be slower, especially on constrained devices. User-visible impact has not been measured.
- **Smallest proposed fix:** Profile the bundle and consider lazy route imports or chart-library chunking; retain the warning threshold unless measurement supports changing it.
- **Regression test:** Build output/chunk budget check plus route smoke coverage.

## Follow-up findings

See [INVOICEIQ_DEEP_AUDIT.md](INVOICEIQ_DEEP_AUDIT.md) for the evidence and proposed reproductions for duplicate normalization (BUG-DUP-01), stale duplicate metadata after edits (BUG-DUP-02), Gemini credential/startup coupling (BUG-CONFIG-01), and absolute storage-path exposure in invoice responses (BUG-API-01). These findings were not fixed in the follow-up pass. Runtime reproduction of the duplicate and serialization cases remains pending review and an approved isolated test setup.