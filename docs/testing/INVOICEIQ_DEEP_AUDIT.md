# InvoiceIQ Deep Audit and Remaining Tests

**Updated:** 2026-10-23  
**Pass type:** Read-only follow-up source/configuration audit. No application code, configuration, dependencies, or database contents were changed in this pass. No provider was called.

## 1. Executive Summary

The earlier QA pass verified a limited set of API behaviors and fixed a create-invoice mass-assignment issue in the existing working tree. This follow-up reviewed the previously untested source paths, existing test quality, API contracts, configuration, storage lifecycle, financial representation, and the existing Git changes.

This review found three code-level defects that should be fixed after review: duplicate matching queries normalized values against stored values that are not normalized; invoice edits retain stale duplicate status; and the application cannot start without GEMINI_API_KEY even though invoice extraction has a disabled-by-default mode. Invoice responses also serialize the absolute storage path for the owner's source document.

No new dynamic regression tests were run. The pasted follow-up explicitly says not to alter database contents before review; the remaining integration tests need either a disposable database approved for this pass or repository mocks and a temporary filesystem. Results below separate earlier runtime evidence from new static findings.

The application can support further manual authentication and CRUD checks in an isolated environment. The full invoice upload/OCR/extraction regression flow is not ready for safe manual testing without a deterministic AI stub/mock and a test storage directory. Production readiness cannot be established from the available evidence.

## 2. Previous Test Coverage

| Area | Existing coverage and verified result | Remaining gap |
| --- | --- | --- |
| Authentication | Earlier pass tested registration validation, normalized duplicate email, case-insensitive login, generic login errors, profile response password omission, and 401 for no/malformed bearer. Existing JUnit checks only JWT expiry parser behavior. | Whitespace email, concurrent register, all missing/null fields, password boundaries, content type, empty/conflicting bearer headers, invalid signature/claims/algorithm, deleted-user tokens, profile/password token semantics, and production log review. |
| Authorization | Earlier isolated two-user test covered invoice list, get, update, delete, confirm, revalidate, duplicate-review and document denial, plus empty-user analytics/dashboard/insights. | Search/filter ownership, malformed/nonexistent IDs, all request identity override paths, expenses, non-empty User A/B metrics, and full route-by-route negative coverage. |
| Invoice upload | Earlier isolated checks: zero-byte file 400, invalid-signature bytes with .pdf name 400, 10 MiB + 1 byte 413. | Exact-size upload, missing/long/unicode/traversal names, extension and MIME permutations, corrupt/truncated structures, valid document, multipart aggregate limits, and repeat uploads. |
| OCR | No valid OCR execution. Source has a 20-page PDF cap and a 20-million-pixel check. | Empty OCR, invalid/corrupt files, Tesseract failures, rendering limits, timeouts, and memory behavior. |
| AI extraction | No provider call. Source checks non-empty input, text length, output mapping and some extracted-value validation. | Mocked null/empty/malformed/provider timeout/4xx/5xx/quota cases, model output edge cases, disabled/mock mode, and persistence failure after extraction. |
| Invoice validation | Earlier isolated HTTP checks covered one valid line-item invoice, total mismatch, confirm, repeated confirm, and edit invalidation. | Zero/negative/null/huge/precision/tolerance values, line-item reconciliation cases, invalid dates/GSTIN, null items, and JSON NaN/infinity behavior. |
| Invoice CRUD | Earlier create/update state and selected owner-scoped operations passed. Create allowlist fix was verified after the change. | Delete lifecycle, update managed-field attack, repeated revalidation, concurrent update, database failure, persistence after refresh, and full duplicate-state transitions. |
| Duplicate detection | No dynamic duplicate scenario was run. | Matching and non-matching cases, normalization, cross-user isolation, edits, concurrency, and reviewed duplicate behavior. Source review found defects below. |
| Expenses | No browser/UI run. The frontend derives Expenses from the invoice list endpoint. | Date filter behavior, status inclusion rules, refresh/stale state, UI values and user isolation. |
| Analytics | Earlier pass checked only empty User B results. | Non-empty calculations, category/vendor/month totals, boundaries, invalid/reversed dates, status inclusion rules and UI/backend parity. |
| AI Insights | Earlier pass checked empty-user response only; no Gemini call occurred because there were no eligible invoices. | Non-empty metrics, duplicate rules, provider failures/timeout, mock mode, privacy consent, output consistency and unnecessary-call controls. |
| Frontend | Earlier build passed; lint failed with three errors. No test or E2E script exists in frontend package.json. | Login, refresh, protected navigation, upload, invoice edits, errors, Expenses, Analytics, Insights, download and logout flows. |
| MongoDB | Prior Spring context test connected to the explicitly isolated audit database. No configured invoiceiq database mutation. | Index presence and query plans, schema compatibility, missing/null legacy fields, serialization and Mongo failure handling. No index was created or changed. |
| Error handling | Earlier HTTP checks observed 400/401/404/413 cases. | Missing multipart part, invalid query dates, DB/OCR/provider failures, response consistency, internal logging and unexpected exception behavior. |
| Production configuration | Source review found environment-backed JWT/Gemini credentials and localhost-only CORS origins. | Deployment profile, remote Mongo/storage, actual index state, TLS, logging/redaction, operational limits and dependency vulnerability scan. |

## 3. Tests Executed

### Earlier runtime evidence reviewed from INVOICEIQ_TEST_RESULTS.md

| Test | Expected | Recorded actual | Status |
| --- | --- | --- | --- |
| Frontend production build | Build exits successfully | Vite transformed 705 modules and exited 0; emitted 832.80 kB minified main chunk warning | PASS |
| Frontend lint | ESLint exits 0 | Three react-hooks/set-state-in-effect errors at ExpenseFilters.jsx:102, InvoiceDetails.jsx:99, ProfileSettings.jsx:23 | FAIL |
| Existing backend Maven suite | JUnit suite completes | Isolated rerun: 2 tests, 0 failures/errors/skips; contextLoads and expiredTokenShouldBeRejected | PASS |
| Protected auth smoke | Reject absent/malformed bearer | /api/auth/me returned 401 for both cases | PASS |
| Isolated invoice creation allowlist | Server-owned fields cannot be forged | Server ID, owner and timestamps returned; request-supplied status/validation/duplicate/document fields ignored after the controller change | PASS |
| Selected two-user isolation | User B cannot access User A invoice | Tested paths returned 404; B list empty; A invoice remained readable | PASS for tested paths only |
| Upload rejection | Reject empty, invalid signature and over-limit | 400, 400 and 413 respectively | PASS for tested cases |
| Invoice state | Validate, confirm, reject invalid/repeat and clear validation after edit | Recorded expected state transitions | PASS for tested cases |
| Browser login/upload/extraction/list | Complete frontend flow | Frontend port 5173 was not listening | NOT RUN |
| Source-file cleanup on invoice deletion | Delete associated upload under lifecycle policy | Source path only inspected; no isolated filesystem/database reproduction | NEEDS REVIEW |

### Follow-up pass

No new runtime or integration tests were executed. I used repository reads/searches and Git status/diff inspection only. Database-writing tests were withheld under the pasted instruction not to alter database contents before review. The configured invoiceiq database was not queried or changed in this follow-up. No valid document was sent to OCR/AI and no external provider request was made.

## 4. Confirmed Bugs

### BUG-DUP-01: Duplicate search normalizes only the candidate invoice

- **Severity:** Medium; duplicate invoices may escape detection.
- **Status:** Code-confirmed; runtime reproduction not run in this pass.
- **Evidence:** DuplicateDetectionService.java:30-47 and :68-71 uppercases/trims candidate vendor and invoice number before exact repository equality queries. InvoiceMapperService.java maps vendor name and invoice number directly from extraction without applying the same normalization. Existing persisted values therefore commonly retain title case or whitespace.
- **Reproduction:** In a disposable test repository/database, persist a User A invoice with vendor Acme Ltd and invoice number inv-01, then check a second invoice with the same values. The service queries for ACME LTD and INV-01 while the stored fields remain Acme Ltd and inv-01; the exact-match query can return empty. The secondary date/total check also queries the normalized vendor name.
- **Expected:** Same-user matching should apply a consistent canonicalization or case-insensitive database comparison.
- **Actual from source:** Query values are canonicalized but stored values are not; runtime result remains to be measured.
- **Impact:** Duplicate invoices can be treated as new and flow into completed spend/analytics.
- **Proposed remediation:** Choose and document a canonical comparison strategy; do not silently rewrite existing invoice data. Prefer normalized comparison/index fields or a database query strategy that compares consistently. Test mixed case, extra whitespace, invoice-number case, date/total fallback and cross-user isolation.

### BUG-DUP-02: Editing an invoice leaves its duplicate result stale

- **Severity:** Medium; duplicate decisions and downstream reporting may no longer match invoice contents.
- **Status:** Code-confirmed; runtime reproduction not run in this pass.
- **Evidence:** InvoiceService.java:148-165 copies editable vendor/number/date/amount fields and clears validation/status, but does not clear or recompute duplicate state. Duplicate detection is invoked in InvoiceProcessingService during upload, not by update/revalidation.
- **Reproduction:** In an isolated test, create two same-user invoices that are flagged as potential duplicates; edit one to a different vendor/number. Then inspect its duplicate field. Also edit a non-duplicate to match another invoice.
- **Expected:** Duplicate metadata should correspond to current invoice values under the documented review policy.
- **Actual from source:** The old duplicate object remains attached after the values change.
- **Impact:** A now-unique invoice may remain excluded from AI Insights, or a newly matching invoice may be counted as unique.
- **Proposed remediation:** Define when edits invalidate duplicate review, then recompute or reset duplicate state on edits. Add regression tests in both directions and verify review decisions are not retained for changed invoice identity fields.

### BUG-CONFIG-01: Gemini credentials are required even when extraction is configured disabled

- **Severity:** Medium; startup/test environments without the provider credential fail before routes become available.
- **Status:** Runtime failure was observed in the earlier pass; follow-up source review confirms the configuration path.
- **Evidence:** application.properties:11 uses gemini.api.key=${GEMINI_API_KEY} without a default. AIInsightsService.java:29 requires the property and initializes a RestClient unconditionally at :37-46. AIExtractionService.java:51 defaults gemini.enabled to false, but that does not make the overall application independent of the key. The earlier first Maven context run failed because GEMINI_API_KEY was absent; a fake process-local value was needed for the successful isolated rerun.
- **Reproduction:** Start the application/test context with JWT_SECRET set and GEMINI_API_KEY absent.
- **Expected:** If Gemini is optional/mockable, app startup and non-provider features should work without a real AI credential.
- **Actual:** Spring cannot resolve the required placeholder and fails context startup; if a placeholder is supplied while extraction remains disabled, AIInsights still constructs a provider client and has no disabled/mock guard for eligible invoices.
- **Impact:** Local development, deterministic tests and offline/manual validation are blocked; supplying a real credential can cause unintended external calls.
- **Proposed remediation:** Decide the supported provider-off/mock behavior first, then make both extraction and insights follow one explicit feature setting and injectable transport. Keep this as a proposal until reviewed. Add startup tests with no key and mocked provider tests that assert zero outbound requests when disabled.

### BUG-API-01: Invoice responses expose the stored absolute upload path

- **Severity:** Low; internal filesystem layout is disclosed to the owning authenticated user.
- **Status:** Code-confirmed serialization path; no runtime response was captured in this pass.
- **Evidence:** FileStorageService.java returns an absolute path; InvoiceProcessingService.java:96 stores it in SourceDocument.storageUrl; SourceDocument is a Lombok data class exposing the field; InvoiceController.java:90-118 returns Invoice entities for list/detail and :121-135 returns the entity for update. The create route also returns an Invoice entity.
- **Reproduction:** Use a test-owned uploaded invoice, then request GET /api/invoices or GET /api/invoices/{id} and inspect sourceDocument.storageUrl.
- **Expected:** API DTOs expose only document metadata needed by the client, not server filesystem paths.
- **Actual from source:** Direct entity serialization includes the storageUrl property unless a serializer rule elsewhere removes it; no such rule was found in the reviewed source.
- **Impact:** Reveals deployment path and storage layout, and couples public API shape to persistence details.
- **Proposed remediation:** Return a response DTO that omits storageUrl; keep download access through the owner-checked document route. Add serialization and authorization tests.

### Previously fixed finding retained in working tree

The earlier audit fixed BUG-00, invoice-create mass assignment, in InvoiceController.java. The after-fix HTTP check passed in an isolated database. This follow-up made no change to that file and did not discard or replace the existing working-tree change.

## 5. Potential Risks

These are not reproduced defects because the governing policy or runtime behavior needs a separate test:

1. **Source-file retention after invoice deletion:** InvoiceService.java:304-319 deletes only the Mongo record. It has no FileStorageService dependency or cleanup call. If product policy is deletion of the original document, this leaves a file behind; retention policy is not documented, so confirm it before calling this a defect.
2. **Image decompression and OCR resource exhaustion:** FileStorageService limits compressed upload bytes, but OCRService uses ImageIO.read before checking pixel count. A small compressed image may require a large decode allocation before the 20-million-pixel check. PDF processing renders pages synchronously; there is no worker/concurrency limit visible in this path. Reproduce only with generated fixtures in a memory-limited test process.
3. **AI Insights outbound timeout and provider disclosure:** AIInsightsService builds a RestClient without explicit connect/read timeouts and sends invoice numbers, vendors, dates, categories and amounts to Gemini whenever eligible invoices exist. Extraction has explicit timeouts, but Insights does not. No provider request was made. Document consent/retention and test with a mocked server.
4. **Unbounded invoice reads and missing query indexes:** AnalyticsService and DashboardService call findByUserId and aggregate in memory; invoice/expense list also returns a complete user list. Invoice entity has no declared user/date compound index. This may become slow or memory-heavy at scale; measure with synthetic local data before adding indexes or pagination.
5. **Financial precision and null mapping:** Invoice and InvoiceItem store money/quantity as primitive double. Validation uses a 0.01 tolerance. InvoiceMapperService maps missing scalar values to 0.0 after validation. No precision boundary tests were run; assess cents/tolerance behavior before deciding whether BigDecimal migration is warranted.
6. **Analytics status rules are unclear:** AnalyticsService and DashboardService include all user invoices in sums; AI Insights filters to COMPLETED and excludes unreviewed duplicates. Confirm whether pending, invalid, or duplicate invoices are intended to count in Expenses/Analytics.
7. **Malformed query errors may map to 500:** AnalyticsController binds ISO date query parameters to LocalDate; GlobalExceptionHandler has no specific type-mismatch handler and its fallback returns 500. Test invalid and reversed date ranges to confirm response behavior.
8. **Mongo index state is unknown:** User.email has @Indexed(unique=true), and AuthService relies on duplicate-key handling for a concurrent registration race. No live index inspection was done and no index was created. Verify index creation in the isolated deployment setup before relying on the race protection.
9. **JWT revocation semantics:** The filter loads the user by email on each request, so a deleted/missing user does not authenticate; there is no token version/revocation mechanism. A token otherwise remains usable until its 24-hour expiry, including after logout or profile changes. Decide whether this is acceptable for the threat model.
10. **Single-environment configuration:** application.properties hard-codes mongodb://localhost:27017/invoiceiq and there is no reviewed production profile. SecurityConfig permits localhost Vite origins only. Upload directory is resolved from process working directory. Configure remote Mongo, production origins and durable storage explicitly; behavior across profiles or changed working directories was not tested.
11. **Sensitive response logging:** JwtService logs decoded key length, not the secret value. The earlier local debug run recorded a login response object containing a disposable token; debug logging/redaction must be checked in the deployment profile. No real token or credential is included in this report.
12. **Dependency security:** Maven/npm compilation does not establish dependency safety. No vulnerability scanner/database was available in the existing scripts, and no dependency was installed or updated for this audit.

## 6. Missing Test Coverage

Tests needing a separate safe setup include:

- JWT token generation/verification through the production JwtService and filter: expiry, wrong key/signature, missing subject, unexpected algorithm, whitespace/empty/multiple authorization headers, and absent/deleted user.
- Registration whitespace/case boundaries, null/missing fields, password length 5/6, malformed JSON/content type, and concurrent normalized email registration against a temporary Mongo instance.
- Two-user search/filter, update managed-field attempts, expense route/data, malformed/nonexistent IDs, and non-empty analytics/insights datasets.
- File name/extension/MIME matrix, exact limit, corrupt/truncated structures, valid benign PDF/PNG/JPEG, path handling, cleanup after each pipeline failure, repeated upload, restart under a changed working directory, and authorized download.
- OCR empty/error/time/resource tests with generated fixtures and isolated temporary storage.
- AI response null/empty/malformed/schema/type/negative/large/date failures, HTTP 4xx/5xx/timeouts, disabled-mode zero calls, and no persistence/orphans after downstream failure. Use a local mock transport; do not use paid Gemini.
- Numeric tolerance boundaries, null/zero/negative/large values, line-item arithmetic, GSTIN/date rules, duplicate behavior, and analytics calculations.
- Frontend tests for login/token expiry/logout, reload, filter dates, stale/error state, upload/error display, edits/revalidation, document download, and page parity. No frontend test runner is configured.
- Mongo index listing/query plans and legacy-schema compatibility in a disposable Mongo instance.
- Production profile, logging redaction, CORS, storage, resource, backup and dependency scanning.

## 7. Security Findings

- **Positive evidence:** BCryptPasswordEncoder is configured; JWT uses signed claims with expiry; the filter verifies signature/expiry and resolves the subject to a current server-side user; protected routes require authentication; profile responses are DTOs that omit the password; user-owned invoice repository lookups include userId; document download first checks invoice ownership and normalizes the stored path beneath the upload root; content type is constrained and X-Content-Type-Options is set.
- **Open:** absolute path exposure through serialized Invoice entities (BUG-API-01); startup/provider setting mismatch (BUG-CONFIG-01); no runtime coverage for token edge cases or every route; JWT is stored in browser localStorage; 401 interceptor only logs, while the startup /me rejection clears auth state; provider sends invoice data externally; no demonstrated rate limiting; no deployment-level TLS/CORS/log verification.
- **Secrets:** application configuration uses environment placeholders and ignore rules exclude local properties/environment files. The tracked-file path check found no tracked .env/application-properties candidate. This is not a Git history secret scan and does not certify runtime secret management.

## 8. Data Integrity Findings

- Duplicate comparisons can miss case/whitespace variants because the query canonicalizes only the incoming values (BUG-DUP-01).
- Editing invoice identifying fields leaves the previous duplicate match/review decision attached (BUG-DUP-02).
- Deleting an invoice removes only the database record; the original file remains unless a separate retention job exists (potential lifecycle risk).
- Analytics/dashboard currently count all invoices; AI Insights counts only completed invoices with duplicate filtering. Product counting rules need to be agreed and tested.
- Monetary data is binary floating point and has no upper bound visible in the entity. Previous total mismatch check passed one example only; correctness for rounding boundaries is unknown.
- Pipeline failure cleanup is present in InvoiceProcessingService for caught processing exceptions. Failure-after-save and delete lifecycle behavior were not dynamically verified.

## 9. Regression Results

The earlier limited regression checks passed for registration/login, protected API rejection, invoice create allowlisting, selected two-user ownership routes, upload rejection, and selected validation/state changes. The frontend production build passed and lint failed. The backend existing suite passed 2/2 on the isolated rerun.

The full requested regression flow—valid document upload, OCR, deterministic extraction, persisted refresh, duplicate review, Expenses, Analytics, AI Insights with mock response, source-document download and failure cleanup—remains NOT RUN. No claim of end-to-end regression success is made.

## 10. Recommended Fix Order

1. Fix duplicate comparison canonicalization and recompute/invalidate duplicate metadata on edits; add tests first.
2. Make AI provider-off/mock behavior explicit so application startup and tests do not require a real Gemini key; ensure disabled mode makes zero outbound calls.
3. Remove internal storage paths from API response serialization using DTOs.
4. Agree and implement the document deletion/retention lifecycle, then test invoice and file cleanup together.
5. Bound OCR decode/render concurrency and test compressed-image resource limits; add explicit AI Insights timeouts.
6. Add request type-mismatch error mapping and exercise invalid/reversed date parameters.
7. Add non-empty analytics/expense/insights and money precision tests; decide whether state/duplicate records count.
8. Resolve the three lint failures, then add frontend tests and complete an isolated manual/browser regression flow.
9. Verify Mongo indexes/query plans, production profiles/logging/CORS/storage and run a dependency vulnerability scanner when available.

## 11. Exact Commands and Results

### Follow-up audit commands

- `git status --short`, `git diff --stat`, `git diff --check`: read-only working-tree inspection; whitespace check completed with only a Git line-ending warning for JwtServiceTest.java.
- `rg --files`, `rg -n`, `Get-Content`: repository discovery and source/configuration review; no files changed by these commands.
- No Maven test, frontend build/lint, HTTP mutation, database write, OCR operation, AI call, load test, or dependency scanner was run in the follow-up pass.

### Earlier commands recorded in INVOICEIQ_TEST_RESULTS.md

- `npm run build` in InvoiceIQ_Frontend — PASS; emitted the large-chunk advisory.
- `npm run lint` in InvoiceIQ_Frontend — FAIL; three React Hook lint errors.
- `.\mvnw.cmd test` — wrapper bootstrap failed before Maven started.
- Cached Maven 3.9.16 `mvn test` — first context attempt failed on missing GEMINI_API_KEY; isolated rerun with process-local test values and invoiceiq_audit_test URI passed 2 tests, 0 failures/errors/skips.
- Read-only GET /api/auth/me — 401 without token and with malformed bearer.
- Selected HTTP API tests used separate invoiceiq_audit_* database names, not the configured invoiceiq database.

## 12. Files to Change After Review

No application files were changed in this follow-up. If the findings are approved, the likely minimal files are:

- Duplicate logic: InvoiceIQ_Backend/src/main/java/com/invoiceiq/InvoiceIQ/service/DuplicateDetectionService.java, InvoiceMapperService.java, and InvoiceService.java.
- Optional/mock provider configuration: InvoiceIQ_Backend/src/main/resources/application.properties, AIExtractionService.java, AIInsightsService.java, plus focused backend tests.
- API path disclosure: InvoiceController.java and a new invoice response DTO (with frontend contract adjustments only if required).
- File retention/deletion: InvoiceService.java and FileStorageService.java, after product retention policy is decided.
- Type mismatch responses: GlobalExceptionHandler.java and controller tests.
- Frontend test coverage/lint: InvoiceIQ_Frontend/package.json only if adding a test framework is approved; no dependency was installed in this audit.

The existing uncommitted InvoiceController allowlist fix and documentation were preserved. Git status also lists JwtServiceTest.java as modified, but its content diff is empty; the only Git message is an LF/CRLF normalization warning. No implementation is proposed as an automatic change; review these findings before approving remediation.