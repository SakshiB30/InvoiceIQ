# InvoiceIQ QA Scenario Matrix

**Updated:** 2026-10-23

**Coverage:** 53 PASS, 36 NEEDS REVIEW, 302 NOT RUN (391 numbered scenarios). Status reflects this first audit pass only. PASS entries point to executed grouped evidence in INVOICEIQ_TEST_RESULTS.md; partial or source-only checks remain NEEDS REVIEW.

This register includes every numbered scenario in the supplied QA brief. `PASS` means an executed runtime check passed. `NEEDS REVIEW` means only source/configuration evidence or partial runtime coverage exists. `NOT RUN` means no test execution was performed for that scenario in this pass. Refer to `INVOICEIQ_TEST_RESULTS.md` for commands, request details, and grouped evidence.

| Test ID | Requested scenario | Status | Evidence note |
| --- | --- | --- | --- |
| AUTH-01 | Register with valid details. | PASS | Evidence: `AUTH-REG-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-02 | Register with an existing email. | PASS | Evidence: `AUTH-REG-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-03 | Register with an invalid email. | PASS | Evidence: `AUTH-REG-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-04 | Register with a password shorter than the configured minimum. | PASS | Evidence: `AUTH-REG-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-05 | Register with missing required fields. | NOT RUN | Not executed in this pass. |
| AUTH-06 | Register with malformed JSON. | PASS | Evidence: `AUTH-REG-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-07 | Login with correct credentials. | PASS | Evidence: `AUTH-LOGIN-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-08 | Login with an incorrect password. | PASS | Evidence: `AUTH-LOGIN-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-09 | Login with an unknown email. | PASS | Evidence: `AUTH-LOGIN-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-10 | Test email normalization and case handling. | PASS | Evidence: `AUTH-LOGIN-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-11 | Access a protected endpoint without a JWT. | PASS | Evidence: `AUTH-SMOKE-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-12 | Access a protected endpoint using a malformed JWT. | PASS | Evidence: `AUTH-SMOKE-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-13 | Access a protected endpoint using a tampered JWT. | NOT RUN | Not executed in this pass. |
| AUTH-14 | Access a protected endpoint using an expired JWT. | NOT RUN | Not executed in this pass. |
| AUTH-15 | Access a protected endpoint using a valid JWT. | PASS | Evidence: `AUTH-PROFILE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-16 | Attempt to use a token with an invalid signature. | NOT RUN | Not executed in this pass. |
| AUTH-17 | Verify that registration and login are public only where intended. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| AUTH-18 | Verify that protected endpoints require authentication. | NEEDS REVIEW | Covered by an isolated API check or executed build/test as applicable; see grouped result by ID prefix. |
| AUTH-19 | Update the authenticated user's profile. | NOT RUN | Not executed in this pass. |
| AUTH-20 | Verify that profile responses never expose the password hash. | PASS | Evidence: `AUTH-PROFILE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-21 | Verify that login failures do not reveal whether an email exists. | PASS | Evidence: `AUTH-LOGIN-01/02` in `INVOICEIQ_TEST_RESULTS.md`. |
| AUTH-22 | Verify BCrypt password hashing. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| AUTH-23 | Verify unique-email enforcement in MongoDB. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| AUTH-24 | Test concurrent registration with the same normalized email using isolated test data. | NOT RUN | Not executed in this pass. |
| AUTH-25 | Verify token expiration configuration. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| AUTH-26 | Verify the behavior of the diagnostic endpoint `/api/auth/test`. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| AUTH-27 | Verify that JWT secrets come from external configuration. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| AUTH-28 | Check whether login rate limiting or another abuse-control mechanism exists. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| SEC-01 | User A creates an invoice. | PASS | Evidence: `SEC-CREATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-02 | User B lists invoices. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-03 | User B requests User A's invoice by ID. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-04 | User B attempts to update User A's invoice. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-05 | User B attempts to delete User A's invoice. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-06 | User B attempts to confirm User A's invoice. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-07 | User B attempts to revalidate User A's invoice. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-08 | User B attempts to review User A's duplicate decision. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-09 | User B attempts to download User A's original document. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-10 | User B attempts to retrieve User A's AI insights. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| SEC-11 | Verify that analytics are scoped to the authenticated user. | PASS | Evidence: `SEC-ISO-02` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-12 | Verify that Expenses data is scoped to the authenticated user. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| SEC-13 | Submit a forged `userId` in a request body. | PASS | Evidence: `SEC-CREATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-14 | Submit a forged `userId` as a query parameter where applicable. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| SEC-15 | Verify that the backend uses the authenticated principal rather than trusting a client-supplied identity. | PASS | Evidence: `SEC-CREATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| SEC-16 | Attempt to modify server-managed fields through create and update endpoints. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| SEC-17 | Verify that one user's data is never included in another user's responses. | NEEDS REVIEW | Covered by an isolated API check or executed build/test as applicable; see grouped result by ID prefix. |
| SEC-18 | Verify that unauthorized resource access does not reveal another user's invoice details. | PASS | Covered by an isolated API check or executed build/test as applicable; see grouped result by ID prefix. |
| FILE-01 | Upload a valid PDF invoice. | NOT RUN | Not executed in this pass. |
| FILE-02 | Upload a valid PNG invoice. | NOT RUN | Not executed in this pass. |
| FILE-03 | Upload a valid JPEG invoice. | NOT RUN | Not executed in this pass. |
| FILE-04 | Upload an empty file. | PASS | Evidence: `FILE-REJECT-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| FILE-05 | Upload a file larger than the configured 10 MB per-file limit. | PASS | Evidence: `FILE-REJECT-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| FILE-06 | Upload a file close to the permitted limit. | NOT RUN | Not executed in this pass. |
| FILE-07 | Upload a file exactly at the intended limit. | NOT RUN | Not executed in this pass. |
| FILE-08 | Upload a `.txt` file. | NOT RUN | Not executed in this pass. |
| FILE-09 | Upload a `.docx` file. | NOT RUN | Not executed in this pass. |
| FILE-10 | Upload an executable renamed to `.pdf`. | NOT RUN | Not executed in this pass. |
| FILE-11 | Upload a PNG with a `.pdf` extension. | NOT RUN | Not executed in this pass. |
| FILE-12 | Upload a PDF with a `.jpg` extension. | NOT RUN | Not executed in this pass. |
| FILE-13 | Supply a misleading client MIME type. | PASS | Evidence: `FILE-REJECT-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| FILE-14 | Upload a file without an original filename. | NOT RUN | Not executed in this pass. |
| FILE-15 | Upload filenames containing path traversal patterns. | NOT RUN | Not executed in this pass. |
| FILE-16 | Upload filenames containing control characters. | NOT RUN | Not executed in this pass. |
| FILE-17 | Upload multiple files with the same original filename. | NOT RUN | Not executed in this pass. |
| FILE-18 | Verify that generated storage filenames are unique. | NOT RUN | Not executed in this pass. |
| FILE-19 | Verify that storage paths cannot escape the upload directory. | NOT RUN | Not executed in this pass. |
| FILE-20 | Verify symbolic-link and real-path handling. | NOT RUN | Not executed in this pass. |
| FILE-21 | Upload a file with a valid signature but invalid internal structure. | NOT RUN | Not executed in this pass. |
| FILE-22 | Verify PDF parsing and image decoding before or during processing. | NOT RUN | Not executed in this pass. |
| FILE-23 | Force a file-copy failure in a controlled test. | NOT RUN | Not executed in this pass. |
| FILE-24 | Force OCR failure after a file has been stored. | NOT RUN | Not executed in this pass. |
| FILE-25 | Force AI extraction failure after a file has been stored. | NOT RUN | Not executed in this pass. |
| FILE-26 | Force database persistence failure after upload. | NOT RUN | Not executed in this pass. |
| FILE-27 | Verify cleanup of partial or orphaned files. | NOT RUN | Not executed in this pass. |
| FILE-28 | Verify that cleanup never removes documents belonging to unrelated invoices. | NOT RUN | Not executed in this pass. |
| FILE-29 | Verify that the upload directory is not publicly served by the frontend. | NOT RUN | Not executed in this pass. |
| FILE-30 | Verify that download endpoints check authentication and invoice ownership. | NOT RUN | Not executed in this pass. |
| FILE-31 | Verify safe `Content-Disposition` behavior. | NOT RUN | Not executed in this pass. |
| FILE-32 | Verify `X-Content-Type-Options: nosniff`. | NOT RUN | Not executed in this pass. |
| FILE-33 | Verify correct download content type. | NOT RUN | Not executed in this pass. |
| FILE-34 | Verify appropriate responses for missing documents and invalid stored paths. | NOT RUN | Not executed in this pass. |
| FILE-35 | Verify both Spring multipart limits and service-level limits. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| FILE-36 | Verify that oversized requests return an appropriate client-error status, ideally HTTP 413. | PASS | Evidence: `FILE-REJECT-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| FILE-37 | Verify that failed upload requests do not expose filesystem paths. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| OCR-01 | Text-based PDF. | NOT RUN | Not executed in this pass. |
| OCR-02 | Scanned PDF. | NOT RUN | Not executed in this pass. |
| OCR-03 | PNG invoice. | NOT RUN | Not executed in this pass. |
| OCR-04 | JPEG invoice. | NOT RUN | Not executed in this pass. |
| OCR-05 | Blank document. | NOT RUN | Not executed in this pass. |
| OCR-06 | Corrupt PDF. | NOT RUN | Not executed in this pass. |
| OCR-07 | Unsupported file content. | NOT RUN | Not executed in this pass. |
| OCR-08 | Poor-quality or blurry invoice. | NOT RUN | Not executed in this pass. |
| OCR-09 | Rotated invoice where supported. | NOT RUN | Not executed in this pass. |
| OCR-10 | Multi-page PDF. | NOT RUN | Not executed in this pass. |
| OCR-11 | Large but permitted PDF. | NOT RUN | Not executed in this pass. |
| OCR-12 | Document containing text that resembles malformed invoice fields. | NOT RUN | Not executed in this pass. |
| OCR-13 | OCR returning null. | NOT RUN | Not executed in this pass. |
| OCR-14 | OCR returning an empty string. | NOT RUN | Not executed in this pass. |
| OCR-15 | OCR throwing an exception. | NOT RUN | Not executed in this pass. |
| OCR-16 | Missing Tesseract configuration or language data. | NOT RUN | Not executed in this pass. |
| OCR-17 | Verify cleanup and error handling after OCR failure. | NOT RUN | Not executed in this pass. |
| OCR-18 | Verify that sensitive extracted text is not unnecessarily logged. | NOT RUN | Not executed in this pass. |
| OCR-19 | Check for resource exhaustion risks from unusually complex documents. | NOT RUN | Not executed in this pass. |
| OCR-20 | Verify OCR output is passed safely into AI extraction. | NOT RUN | Not executed in this pass. |
| AI-01 | Valid invoice extraction. | NOT RUN | Not executed in this pass. |
| AI-02 | Missing vendor name. | NOT RUN | Not executed in this pass. |
| AI-03 | Missing invoice number. | NOT RUN | Not executed in this pass. |
| AI-04 | Missing invoice date. | NOT RUN | Not executed in this pass. |
| AI-05 | Missing subtotal. | NOT RUN | Not executed in this pass. |
| AI-06 | Missing tax. | NOT RUN | Not executed in this pass. |
| AI-07 | Missing total. | NOT RUN | Not executed in this pass. |
| AI-08 | Missing line items. | NOT RUN | Not executed in this pass. |
| AI-09 | Null AI response. | NOT RUN | Not executed in this pass. |
| AI-10 | Empty AI response. | NOT RUN | Not executed in this pass. |
| AI-11 | Malformed JSON response. | NOT RUN | Not executed in this pass. |
| AI-12 | Invalid date representation. | NOT RUN | Not executed in this pass. |
| AI-13 | Invalid numeric values. | NOT RUN | Not executed in this pass. |
| AI-14 | Negative values. | NOT RUN | Not executed in this pass. |
| AI-15 | Extremely large numeric values. | NOT RUN | Not executed in this pass. |
| AI-16 | Document that is not an invoice. | NOT RUN | Not executed in this pass. |
| AI-17 | AI timeout. | NOT RUN | Not executed in this pass. |
| AI-18 | AI provider returns an error. | NOT RUN | Not executed in this pass. |
| AI-19 | AI provider returns unexpected fields. | NOT RUN | Not executed in this pass. |
| AI-20 | Gemini disabled mode. | NOT RUN | Not executed in this pass. |
| AI-21 | Gemini enabled mode, only when credentials and network access are explicitly available. | NOT RUN | Not executed in this pass. |
| AI-22 | Verify that mock mode does not unexpectedly call Gemini. | NOT RUN | Not executed in this pass. |
| AI-23 | Verify that AI failure does not create invalid completed invoices. | NOT RUN | Not executed in this pass. |
| AI-24 | Verify that failures do not create duplicate records or orphaned files. | NOT RUN | Not executed in this pass. |
| AI-25 | Verify that API keys are not exposed in frontend bundles or logs. | NOT RUN | Not executed in this pass. |
| AI-26 | Verify whether repeated dashboard or Insights requests cause unnecessary AI calls. | NOT RUN | Not executed in this pass. |
| AI-27 | Verify safe handling of untrusted document text and extracted output. | NOT RUN | Not executed in this pass. |
| VAL-01 | Null invoice DTO. | NOT RUN | Not executed in this pass. |
| VAL-02 | Missing vendor name. | NOT RUN | Not executed in this pass. |
| VAL-03 | Missing invoice number. | NOT RUN | Not executed in this pass. |
| VAL-04 | Missing invoice date. | NOT RUN | Not executed in this pass. |
| VAL-05 | Missing subtotal. | NOT RUN | Not executed in this pass. |
| VAL-06 | Missing tax. | NOT RUN | Not executed in this pass. |
| VAL-07 | Missing total. | NOT RUN | Not executed in this pass. |
| VAL-08 | Invalid GSTIN format. | NOT RUN | Not executed in this pass. |
| VAL-09 | Valid-looking GSTIN format. | NOT RUN | Not executed in this pass. |
| VAL-10 | Negative subtotal. | NOT RUN | Not executed in this pass. |
| VAL-11 | Negative tax. | NOT RUN | Not executed in this pass. |
| VAL-12 | Negative total. | NOT RUN | Not executed in this pass. |
| VAL-13 | NaN values. | NOT RUN | Not executed in this pass. |
| VAL-14 | Positive and negative infinity. | NOT RUN | Not executed in this pass. |
| VAL-15 | Extremely large finite values. | NOT RUN | Not executed in this pass. |
| VAL-16 | Due date before invoice date. | NOT RUN | Not executed in this pass. |
| VAL-17 | Zero quantity. | NOT RUN | Not executed in this pass. |
| VAL-18 | Negative quantity. | NOT RUN | Not executed in this pass. |
| VAL-19 | Missing quantity. | NOT RUN | Not executed in this pass. |
| VAL-20 | Negative unit price. | NOT RUN | Not executed in this pass. |
| VAL-21 | Missing unit price. | NOT RUN | Not executed in this pass. |
| VAL-22 | Negative item amount. | NOT RUN | Not executed in this pass. |
| VAL-23 | Missing item amount. | NOT RUN | Not executed in this pass. |
| VAL-24 | Quantity multiplied by unit price does not match amount. | NOT RUN | Not executed in this pass. |
| VAL-25 | Sum of line items does not match subtotal. | NOT RUN | Not executed in this pass. |
| VAL-26 | Subtotal plus tax does not match total. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| VAL-27 | Rounding differences near the configured tolerance. | NOT RUN | Not executed in this pass. |
| VAL-28 | Empty item list. | NOT RUN | Not executed in this pass. |
| VAL-29 | Null item inside the list. | NOT RUN | Not executed in this pass. |
| VAL-30 | Null item description. | NOT RUN | Not executed in this pass. |
| VAL-31 | Extremely large item quantity or price. | NOT RUN | Not executed in this pass. |
| VAL-32 | Multiple items whose sum exceeds the supported numeric range. | NOT RUN | Not executed in this pass. |
| VAL-33 | Valid invoice containing discounts or shipping charges, if supported. | NOT RUN | Not executed in this pass. |
| VAL-34 | Valid invoice containing legitimate rounding adjustments, if supported. | NOT RUN | Not executed in this pass. |
| VAL-35 | Verify that validation issues are persisted. | NOT RUN | Not executed in this pass. |
| VAL-36 | Verify that invalid invoices cannot be confirmed as completed. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| VAL-37 | Verify that editing an invoice invalidates previous validation when required. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| VAL-38 | Verify that revalidation reflects updated values. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| VAL-39 | Verify that validation does not silently treat missing monetary values as genuine zero values. | NOT RUN | Not executed in this pass. |
| VAL-40 | Review whether `double` is appropriate for financial calculations and whether a gradual `BigDecimal` migration is warranted. | NOT RUN | Not executed in this pass. |
| INV-01 | Create invoice. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-02 | List invoices. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| INV-03 | Search invoices. | NOT RUN | Not executed in this pass. |
| INV-04 | Filter by category. | NOT RUN | Not executed in this pass. |
| INV-05 | Filter by date range. | NOT RUN | Not executed in this pass. |
| INV-06 | Retrieve invoice by ID. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| INV-07 | Update editable invoice fields. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-08 | Submit invalid updates. | NOT RUN | Not executed in this pass. |
| INV-09 | Attempt to modify server-managed fields. | NEEDS REVIEW | Covered by an isolated API check or executed build/test as applicable; see grouped result by ID prefix. |
| INV-10 | Revalidate invoice. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-11 | Confirm valid invoice. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-12 | Attempt to confirm invalid invoice. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-13 | Attempt to confirm the same invoice repeatedly. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-14 | Attempt to edit a completed invoice. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-15 | Attempt invalid processing-status transitions. | NOT RUN | Not executed in this pass. |
| INV-16 | Delete invoice. | NOT RUN | Not executed in this pass. |
| INV-17 | Retrieve deleted invoice. | NOT RUN | Not executed in this pass. |
| INV-18 | Verify persistence after application restart. | NOT RUN | Not executed in this pass. |
| INV-19 | Verify nested vendor and item data. | NOT RUN | Not executed in this pass. |
| INV-20 | Verify timestamps. | PASS | Evidence: `INV-STATE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| INV-21 | Verify invoice ownership after updates. | NEEDS REVIEW | Covered by an isolated API check or executed build/test as applicable; see grouped result by ID prefix. |
| INV-22 | Verify that editing does not accidentally remove source-document metadata. | NOT RUN | Not executed in this pass. |
| INV-23 | Verify that invoice deletion handles associated documents according to the defined retention policy. | NOT RUN | Not executed in this pass. |
| INV-24 | Verify pagination requirements and performance with a large test dataset. | NOT RUN | Not executed in this pass. |
| DUP-01 | New invoice with unique details. | NOT RUN | Not executed in this pass. |
| DUP-02 | Same vendor and invoice number. | NOT RUN | Not executed in this pass. |
| DUP-03 | Same vendor, date, and total according to the current fallback rule. | NOT RUN | Not executed in this pass. |
| DUP-04 | Same invoice number with different vendors. | NOT RUN | Not executed in this pass. |
| DUP-05 | Same invoice details under different users. | NOT RUN | Not executed in this pass. |
| DUP-06 | Duplicate invoice uploaded twice. | NOT RUN | Not executed in this pass. |
| DUP-07 | Duplicate review decision marked as separate. | NOT RUN | Not executed in this pass. |
| DUP-08 | Duplicate review decision marked as duplicate. | NOT RUN | Not executed in this pass. |
| DUP-09 | Invalid review decision. | NOT RUN | Not executed in this pass. |
| DUP-10 | Missing review decision. | NOT RUN | Not executed in this pass. |
| DUP-11 | Duplicate review attempted in an invalid invoice state. | NOT RUN | Not executed in this pass. |
| DUP-12 | Duplicate decision persistence after refresh. | NOT RUN | Not executed in this pass. |
| DUP-13 | Duplicate behavior when vendor name casing differs. | NOT RUN | Not executed in this pass. |
| DUP-14 | Duplicate behavior when invoice numbers contain whitespace. | NOT RUN | Not executed in this pass. |
| DUP-15 | Duplicate behavior when amounts differ only by rounding. | NOT RUN | Not executed in this pass. |
| DUP-16 | Verify duplicate handling in AI Insights and Analytics. | NOT RUN | Not executed in this pass. |
| DUP-17 | Verify that duplicate handling does not accidentally delete invoices or documents. | NOT RUN | Not executed in this pass. |
| EXP-01 | Expenses page loads. | NOT RUN | Not executed in this pass. |
| EXP-02 | Expenses data loads from the expected API. | NOT RUN | Not executed in this pass. |
| EXP-03 | Today filter. | NOT RUN | Not executed in this pass. |
| EXP-04 | Week filter. | NOT RUN | Not executed in this pass. |
| EXP-05 | Month filter. | NOT RUN | Not executed in this pass. |
| EXP-06 | Year filter. | NOT RUN | Not executed in this pass. |
| EXP-07 | Empty state. | NOT RUN | Not executed in this pass. |
| EXP-08 | Backend failure. | NOT RUN | Not executed in this pass. |
| EXP-09 | Expired JWT. | NOT RUN | Not executed in this pass. |
| EXP-10 | Correct totals. | NOT RUN | Not executed in this pass. |
| EXP-11 | Newly completed invoice appears according to current business rules. | NOT RUN | Not executed in this pass. |
| EXP-12 | Invoice update is reflected correctly. | NOT RUN | Not executed in this pass. |
| EXP-13 | Invoice deletion is reflected correctly. | NOT RUN | Not executed in this pass. |
| EXP-14 | Cross-user isolation. | NOT RUN | Not executed in this pass. |
| EXP-15 | Date boundaries and timezone handling. | NOT RUN | Not executed in this pass. |
| EXP-16 | Loading indicators. | NOT RUN | Not executed in this pass. |
| EXP-17 | Error messages. | NOT RUN | Not executed in this pass. |
| EXP-18 | Browser console errors. | NOT RUN | Not executed in this pass. |
| EXP-19 | Refresh behavior. | NOT RUN | Not executed in this pass. |
| EXP-20 | Verify that no unnecessary separate Expense collection or entity is introduced by the test suite. | NOT RUN | Not executed in this pass. |
| ANA-01 | No invoices. | PASS | Evidence: `SEC-ISO-02` in `INVOICEIQ_TEST_RESULTS.md`. |
| ANA-02 | One completed invoice. | NOT RUN | Not executed in this pass. |
| ANA-03 | Multiple completed invoices. | NOT RUN | Not executed in this pass. |
| ANA-04 | Invoices from multiple vendors. | NOT RUN | Not executed in this pass. |
| ANA-05 | Invoices across categories. | NOT RUN | Not executed in this pass. |
| ANA-06 | Different date ranges. | NOT RUN | Not executed in this pass. |
| ANA-07 | Date range with no matching invoices. | NOT RUN | Not executed in this pass. |
| ANA-08 | Invalid date parameters. | NOT RUN | Not executed in this pass. |
| ANA-09 | Start date after end date. | NOT RUN | Not executed in this pass. |
| ANA-10 | Verify total spending. | NOT RUN | Not executed in this pass. |
| ANA-11 | Verify monthly totals. | NOT RUN | Not executed in this pass. |
| ANA-12 | Verify category totals. | NOT RUN | Not executed in this pass. |
| ANA-13 | Verify vendor totals. | NOT RUN | Not executed in this pass. |
| ANA-14 | Verify eligibility of review-required invoices. | NOT RUN | Not executed in this pass. |
| ANA-15 | Verify duplicate exclusions or inclusion according to the actual business rules. | NOT RUN | Not executed in this pass. |
| ANA-16 | Verify user isolation. | PASS | Evidence: `SEC-ISO-02` in `INVOICEIQ_TEST_RESULTS.md`. |
| ANA-17 | Verify chart data matches backend responses. | NOT RUN | Not executed in this pass. |
| ANA-18 | Verify loading and error states. | NOT RUN | Not executed in this pass. |
| ANA-19 | Verify behavior with a large dataset. | NOT RUN | Not executed in this pass. |
| ANA-20 | Verify date and currency formatting. | NOT RUN | Not executed in this pass. |
| INS-01 | No invoices. | PASS | Evidence: `SEC-ISO-02` in `INVOICEIQ_TEST_RESULTS.md`. |
| INS-02 | No completed invoices. | NEEDS REVIEW | Covered by an isolated API check or executed build/test as applicable; see grouped result by ID prefix. |
| INS-03 | One completed invoice. | NOT RUN | Not executed in this pass. |
| INS-04 | Multiple completed invoices. | NOT RUN | Not executed in this pass. |
| INS-05 | Multiple vendors. | NOT RUN | Not executed in this pass. |
| INS-06 | Multiple categories. | NOT RUN | Not executed in this pass. |
| INS-07 | Multiple months. | NOT RUN | Not executed in this pass. |
| INS-08 | Verify total spending. | NOT RUN | Not executed in this pass. |
| INS-09 | Verify monthly spending. | NOT RUN | Not executed in this pass. |
| INS-10 | Verify total invoice count. | NOT RUN | Not executed in this pass. |
| INS-11 | Verify top category. | NOT RUN | Not executed in this pass. |
| INS-12 | Verify top vendor. | NOT RUN | Not executed in this pass. |
| INS-13 | Verify recommendations. | NOT RUN | Not executed in this pass. |
| INS-14 | Verify duplicate exclusions. | NOT RUN | Not executed in this pass. |
| INS-15 | Verify incomplete-invoice exclusions. | NOT RUN | Not executed in this pass. |
| INS-16 | Verify user isolation. | NOT RUN | Not executed in this pass. |
| INS-17 | Verify Gemini disabled mode. | NOT RUN | Not executed in this pass. |
| INS-18 | Verify external AI failure handling. | NOT RUN | Not executed in this pass. |
| INS-19 | Verify malformed AI response handling. | NOT RUN | Not executed in this pass. |
| INS-20 | Verify that mock mode does not unexpectedly make external requests. | NOT RUN | Not executed in this pass. |
| INS-21 | Verify repeated requests do not create unnecessary API usage. | NOT RUN | Not executed in this pass. |
| INS-22 | Verify frontend DTO compatibility. | NOT RUN | Not executed in this pass. |
| INS-23 | Verify empty and null response fields. | NOT RUN | Not executed in this pass. |
| INS-24 | Investigate any discrepancy between persisted invoices and reported spending totals. | NOT RUN | Not executed in this pass. |
| FE-01 | Production build. | PASS | Evidence: `BUILD-FE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| FE-02 | Application startup. | NOT RUN | Not executed in this pass. |
| FE-03 | Login page. | NOT RUN | Not executed in this pass. |
| FE-04 | Registration page. | NOT RUN | Not executed in this pass. |
| FE-05 | Protected routes. | NOT RUN | Not executed in this pass. |
| FE-06 | Login failure display. | NOT RUN | Not executed in this pass. |
| FE-07 | API error handling. | NOT RUN | Not executed in this pass. |
| FE-08 | Token handling. | NOT RUN | Not executed in this pass. |
| FE-09 | Logout behavior. | NOT RUN | Not executed in this pass. |
| FE-10 | Redux state consistency. | NOT RUN | Not executed in this pass. |
| FE-11 | Invoice list rendering. | NOT RUN | Not executed in this pass. |
| FE-12 | Invoice details rendering. | NOT RUN | Not executed in this pass. |
| FE-13 | Invoice upload form validation. | NOT RUN | Not executed in this pass. |
| FE-14 | Invoice edit form validation. | NOT RUN | Not executed in this pass. |
| FE-15 | Confirmation workflow. | NOT RUN | Not executed in this pass. |
| FE-16 | Expenses rendering. | NOT RUN | Not executed in this pass. |
| FE-17 | Analytics rendering. | NOT RUN | Not executed in this pass. |
| FE-18 | Insights rendering. | NOT RUN | Not executed in this pass. |
| FE-19 | Loading states. | NOT RUN | Not executed in this pass. |
| FE-20 | Empty states. | NOT RUN | Not executed in this pass. |
| FE-21 | Error states. | NOT RUN | Not executed in this pass. |
| FE-22 | Browser console errors. | NOT RUN | Not executed in this pass. |
| FE-23 | Unexpected network failures. | NOT RUN | Not executed in this pass. |
| FE-24 | Responsive layout. | NOT RUN | Not executed in this pass. |
| FE-25 | Sidebar navigation and scrolling behavior. | NOT RUN | Not executed in this pass. |
| FE-26 | React warnings and invalid keys. | NOT RUN | Not executed in this pass. |
| FE-27 | Unhandled promise rejections. | NOT RUN | Not executed in this pass. |
| FE-28 | Accidental exposure of secrets in frontend bundles. | NOT RUN | Not executed in this pass. |
| FE-29 | Verify that the frontend does not depend on internal diagnostic endpoints for normal operation. | NOT RUN | Not executed in this pass. |
| FE-30 | Verify compatibility between API responses and Redux reducers. | NOT RUN | Not executed in this pass. |
| ERR-01 | Invalid JSON. | PASS | Evidence: `AUTH-REG-02` in `INVOICEIQ_TEST_RESULTS.md`. |
| ERR-02 | Missing required parameters. | NOT RUN | Not executed in this pass. |
| ERR-03 | Invalid IDs. | NOT RUN | Not executed in this pass. |
| ERR-04 | Invalid enum or status values where applicable. | NOT RUN | Not executed in this pass. |
| ERR-05 | Unauthenticated request. | PASS | Evidence: `AUTH-SMOKE-01 / SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| ERR-06 | Unauthorized resource access. | PASS | Evidence: `SEC-ISO-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| ERR-07 | Nonexistent invoice. | NOT RUN | Not executed in this pass. |
| ERR-08 | Oversized multipart request. | PASS | Evidence: `FILE-REJECT-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| ERR-09 | Unsupported file type. | PASS | Evidence: `FILE-REJECT-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| ERR-10 | Corrupt document. | NOT RUN | Not executed in this pass. |
| ERR-11 | Database unavailable. | NOT RUN | Not executed in this pass. |
| ERR-12 | OCR failure. | NOT RUN | Not executed in this pass. |
| ERR-13 | AI provider failure. | NOT RUN | Not executed in this pass. |
| ERR-14 | File-storage failure. | NOT RUN | Not executed in this pass. |
| ERR-15 | Unexpected runtime exception. | NOT RUN | Not executed in this pass. |
| ERR-16 | Duplicate-key exception. | NOT RUN | Not executed in this pass. |
| ERR-17 | Validation exception. | NOT RUN | Not executed in this pass. |
| ERR-18 | Request validation failure. | PASS | Evidence: `AUTH-REG-02` in `INVOICEIQ_TEST_RESULTS.md`. |
| ERR-19 | Verify consistent HTTP status codes. | NOT RUN | Not executed in this pass. |
| ERR-20 | Verify response bodies do not expose stack traces, filesystem paths, secrets, or sensitive invoice content. | NOT RUN | Not executed in this pass. |
| ERR-21 | Verify that error logs contain useful diagnostic information without exposing credentials. | NOT RUN | Not executed in this pass. |
| ERR-22 | Verify that errors do not falsely report success after partial persistence. | NOT RUN | Not executed in this pass. |
| DB-01 | Unique email index. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-02 | Invoice userId persistence. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-03 | Invoice query ownership filters. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-04 | Invoice lookup by ID and user ID. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-05 | Duplicate detection queries. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-06 | Date filtering. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-07 | Category filtering. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-08 | Data persistence across application restart. | NOT RUN | Not executed in this pass. |
| DB-09 | Nested document serialization. | NOT RUN | Not executed in this pass. |
| DB-10 | Null and missing fields in legacy records. | NOT RUN | Not executed in this pass. |
| DB-11 | Existing records created before any proposed model changes. | NOT RUN | Not executed in this pass. |
| DB-12 | Index coverage for frequently used queries. | NOT RUN | Not executed in this pass. |
| DB-13 | Concurrent writes. | NOT RUN | Not executed in this pass. |
| DB-14 | Orphaned file detection. | NOT RUN | Not executed in this pass. |
| DB-15 | Large result-set performance. | NOT RUN | Not executed in this pass. |
| DB-16 | Pagination needs. | NOT RUN | Not executed in this pass. |
| DB-17 | Query behavior when optional filters are absent. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| DB-18 | Database connection failure handling. | NOT RUN | Not executed in this pass. |
| DB-19 | Backup and restoration requirements. | NOT RUN | Not executed in this pass. |
| PERF-01 | Login response time. | NOT RUN | Not executed in this pass. |
| PERF-02 | Invoice list response time. | NOT RUN | Not executed in this pass. |
| PERF-03 | Invoice detail response time. | NOT RUN | Not executed in this pass. |
| PERF-04 | Invoice upload and OCR duration. | NOT RUN | Not executed in this pass. |
| PERF-05 | AI extraction duration using mocks. | NOT RUN | Not executed in this pass. |
| PERF-06 | Analytics response time. | NOT RUN | Not executed in this pass. |
| PERF-07 | Insights response time. | NOT RUN | Not executed in this pass. |
| PERF-08 | Large invoice-list handling. | NOT RUN | Not executed in this pass. |
| PERF-09 | Memory use during PDF processing. | NOT RUN | Not executed in this pass. |
| PERF-10 | Temporary-file and orphaned-file accumulation. | NOT RUN | Not executed in this pass. |
| PERF-11 | Repeated requests to Insights. | NOT RUN | Not executed in this pass. |
| PERF-12 | Database query efficiency. | NOT RUN | Not executed in this pass. |
| PERF-13 | Upload request limits. | NOT RUN | Not executed in this pass. |
| PERF-14 | Concurrent uploads with a small controlled workload. | NOT RUN | Not executed in this pass. |
| PERF-15 | Timeouts and resource cleanup. | NOT RUN | Not executed in this pass. |
| PROD-01 | Backend Maven build. | NOT RUN | Not executed in this pass. |
| PROD-02 | Frontend production build. | PASS | Evidence: `BUILD-FE-01` in `INVOICEIQ_TEST_RESULTS.md`. |
| PROD-03 | Test suite execution. | NOT RUN | Not executed in this pass. |
| PROD-04 | Environment-variable configuration. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-05 | JWT secret strength and handling. | NOT RUN | Not executed in this pass. |
| PROD-06 | Gemini API key handling. | NOT RUN | Not executed in this pass. |
| PROD-07 | Database credentials and network exposure. | NOT RUN | Not executed in this pass. |
| PROD-08 | `.gitignore` effectiveness. | NOT RUN | Not executed in this pass. |
| PROD-09 | Secret-bearing files tracked by Git. | NOT RUN | Not executed in this pass. |
| PROD-10 | Public exposure of configuration endpoints. | NOT RUN | Not executed in this pass. |
| PROD-11 | CORS restrictions. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-12 | CSRF assumptions for the actual authentication mechanism. | NOT RUN | Not executed in this pass. |
| PROD-13 | Login abuse protection and rate limiting. | NOT RUN | Not executed in this pass. |
| PROD-14 | Upload limits. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-15 | Storage directory permissions. | NOT RUN | Not executed in this pass. |
| PROD-16 | HTTPS deployment assumptions. | NOT RUN | Not executed in this pass. |
| PROD-17 | Error response security. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-18 | Logging practices. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-19 | Dependency versions and known security advisories where verification tools are available. | NOT RUN | Not executed in this pass. |
| PROD-20 | Database backup and recovery. | NOT RUN | Not executed in this pass. |
| PROD-21 | Health checks and operational monitoring. | NOT RUN | Not executed in this pass. |
| PROD-22 | Pagination and growing datasets. | NOT RUN | Not executed in this pass. |
| PROD-23 | Application startup with required configuration. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-24 | Behavior when required configuration is absent. | NEEDS REVIEW | Source/configuration inspection or partial coverage only; the requested runtime scenario is not fully verified. |
| PROD-25 | Deployment-specific CORS and storage settings. | NOT RUN | Not executed in this pass. |
| PROD-26 | Removal or restriction of diagnostic-only endpoints where appropriate. | NOT RUN | Not executed in this pass. |
| PROD-27 | Separation of development and production settings. | NOT RUN | Not executed in this pass. |
| PROD-28 | Review of file-processing resource limits. | NOT RUN | Not executed in this pass. |
| PROD-29 | Review of secrets in Git history when safe repository access is available. | NOT RUN | Not executed in this pass. |
| PROD-30 | Final regression testing. | NOT RUN | Not executed in this pass. |
