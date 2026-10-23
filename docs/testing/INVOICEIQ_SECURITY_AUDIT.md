# InvoiceIQ Security Audit — Initial Findings

**Updated:** 2026-10-23  
**Evidence rule:** Static findings are labeled as such. The HTTP checks below used throwaway accounts and isolated Mongo databases. This is not a penetration test or full security certification.

## Authentication

- **INFORMATIONAL — Unauthenticated access rejection observed.** `GET /api/auth/me` returned 401 without a token and with a malformed bearer token. These two cases do not prove expiry, signature, tampering, or login behavior.
- **NEEDS REVIEW — JWT expiry/signature.** `JwtService` parses signed claims and the filter authenticates only after looking up the subject and validating the token. Existing `JwtServiceTest` only verifies JJWT parser behavior for an expired token; the application service/filter behavior is not tested here.
- **LOW — Password minimum is six characters.** `RegisterRequest` accepts passwords of length six or more. This is a code fact; exploitability depends on deployment policy and other abuse controls. No login rate limiting was found in the inspected auth/controller/security code; check reverse proxy or infrastructure controls before rating this as a production defect.
- **INFORMATIONAL — Secret externalization is configured.** `jwt.secret` and `gemini.api.key` are sourced from environment placeholders in application properties. Secret values were not inspected. `JwtService` startup prints the decoded JWT key length (observed as a length only in test logs); it does not print key material, but the diagnostic can be removed to avoid exposing key characteristics.
- **LOW — Test startup currently requires a Gemini environment variable.** The first `mvn test` context load failed because `GEMINI_API_KEY` was not set, despite extraction being disabled. A rerun with a fake process-local value and isolated Mongo DB passed. This adds avoidable setup friction and can make CI depend on credentials unless test configuration provides a non-secret dummy value or defaults are aligned.

## Authorization and user isolation

- **MEDIUM — Invoice create mass-assignment was fixed and the after-fix behavior passed an isolated HTTP check.** Before the change, `InvoiceController.createInvoice` bound the complete `Invoice` entity from request JSON and passed it to the service. The service overwrote `userId` and timestamps but retained client-supplied `id`, processing status, validation, duplicate result, and source document. An authenticated caller could therefore create an invoice that appeared completed/validated and submit server-managed metadata. The controller now copies only user-editable invoice fields into a new entity. An isolated API request with forged values returned server-owned ID/user/timestamps and ignored server-managed request fields. The original pre-fix behavior was established by code review, not by a database-mutating exploit test.
- **INFORMATIONAL — Route protection is default-deny.** Only registration/login are explicitly public (plus OPTIONS); all other routes require authentication in `SecurityConfig`.
- **INFORMATIONAL — Invoice service methods reviewed are owner-scoped.** Reads/updates/deletes/state changes use `findByIdAndUserId`; lists/search use user-filtered repository methods; create assigns the authenticated user ID; analytics/dashboard use the authenticated ID. The download controller fetches the invoice through the same owner-scoped lookup before resolving its document.
- **INFORMATIONAL — Tested cross-user isolation passed for selected routes.** In an isolated two-user API run, User B's invoice list was empty and read/update/delete/confirm/revalidate/duplicate-review/document requests for User A's invoice each returned 404. User A retained access after User B's denied delete. User B's analytics/dashboard/empty-insights responses contained zero invoices/spend. Non-empty analytics/insights separation and forged update fields remain untested.
- **LOW / NEEDS REVIEW — Profile update.** The profile endpoint takes the current user ID from the security context and only accepts its DTO; dynamic DTO validation and password-field non-disclosure need tests.

## Upload and file storage

- **INFORMATIONAL — Layered constraints reviewed.** Multipart configuration sets 10 MB per file / 12 MB request; storage also checks 10 MiB. Storage uses generated UUID names, checks basic PDF/PNG/JPEG signatures and extension agreement, and download sets content type plus `nosniff` after an ownership lookup.
- **INFORMATIONAL — Three upload rejection cases passed in isolation.** Empty upload returned 400, invalid bytes with a `.pdf` filename returned 400, and a 10 MiB + 1 byte request returned 413. These did not verify valid document processing or parser cleanup.
- **NEEDS REVIEW — Content validation limits.** Magic signatures do not alone establish that a document is a safe/valid PDF or image. OCR parsing/decoding applies further checks, but hostile/corrupt fixtures, symlink behavior, exact boundary sizes, MIME spoofing, and cleanup have not been tested.
- **NEEDS REVIEW — Delete lifecycle.** The invoice deletion path does not invoke source-file cleanup. This may leave orphaned files; reproduce in an isolated storage directory and test that unrelated documents are preserved before changing it.
- **INFORMATIONAL — Error responses.** The global handler maps oversized uploads to 413 and generic exceptions to a generic client message; source review shows server-side exception logging. No HTTP error matrix was run in this pass.

## Secrets, database and external services

- **NEEDS REVIEW — Provider disclosure.** AI extraction sends OCR text to Gemini when enabled. AI insights builds a prompt with invoice numbers, vendor names, dates, categories and financial values, and its service has no visible enable/disable check before provider calls. Confirm this is an intentional user-facing data-processing policy and configure/test provider behavior with mocked transport; no provider call was made.
- **LOW / NEEDS REVIEW — Token logging depends on runtime log level.** The login controller returns the JWT directly as a `String`. During the isolated local run, Spring MVC debug logging emitted the response object; test output indicated that the response body was represented in a log message. This run used a disposable test JWT. Verify the effective production log level and ensure MVC response-body debug logging is disabled or redacts authentication responses.
- **NEEDS REVIEW — Database controls.** `User.email` declares a unique index and registration catches duplicate-key races. Index creation/production MongoDB settings, backup/restore, access controls, and isolation were not exercised.
- **INFORMATIONAL — CORS is restricted in source.** Allowed origins are `http://localhost:5173` and `:5174`; production-origin configuration/deployment profile was not inspected in this pass.

## Severity summary

No CRITICAL or HIGH vulnerability was demonstrated in this pass. A MEDIUM mass-assignment vulnerability was confirmed by source review, fixed, and verified after the fix; the pre-fix exploit was not run against a database. No other vulnerability was confirmed by executed tests. Remaining source-review risks and coverage gaps must not be described as verified exploits.

## Recommended next checks

1. Add automated JWT/auth tests with mock repositories and an isolated database.
2. Extend two-user ownership tests across Expenses and non-empty insights/analytics datasets, then automate them.
3. Verify provider disclosure/configuration and avoid real Gemini calls during tests.
4. Test upload/parser boundaries and deletion cleanup using only test-owned temporary files.
5. Review deployment CORS, MongoDB access/backup, TLS, rate limiting and secret rotation configuration.

## Follow-up deep audit

The read-only follow-up found that invoice entity responses may expose the owner's absolute source-document storage path. The Gemini key is also required at startup despite extraction's disabled default, and non-empty AI Insights sends invoice fields to the configured provider. These are described with evidence and limits in [INVOICEIQ_DEEP_AUDIT.md](INVOICEIQ_DEEP_AUDIT.md). No database writes, valid-document processing, or external AI calls occurred in the follow-up.