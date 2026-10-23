# InvoiceIQ Test Plan

**Created:** 2026-10-23  
**Scope:** Initial repository discovery and safe first-pass verification. This plan covers the full application audit requested in the QA brief; this milestone does not claim that every category has been executed.

## Architecture map

| Area | Observed implementation |
| --- | --- |
| Backend | Spring Boot 4.1.1, Java target 25, Maven, Spring MVC/Security/Validation, Spring Data MongoDB, JJWT 0.13.0, Tess4J and PDFBox |
| Persistence | MongoDB database configured as `invoiceiq`; `User` and `Invoice` document models and repositories |
| Authentication | Stateless Spring Security filter chain, JWT bearer filter/service, BCrypt password encoder, auth and profile endpoints |
| Invoice workflow | Multipart upload → signature/extension/size checks → disk storage → OCR → Gemini extraction → validation → mapping/category/duplicate checks → invoice persistence |
| Upload storage | Local `uploads` directory; download route checks authenticated invoice ownership and resolves stored path |
| Other backend modules | Dashboard, analytics, AI insights, expense views backed by invoices, validation, categorization, duplicate detection |
| Frontend | React 19, Vite 8, React Router 7, Redux Toolkit, Axios, Tailwind CSS, Recharts |
| Existing tests | Two JUnit test classes: one JWT expiry test and one Spring application-context test. No frontend test runner or E2E framework is declared. |

## Test environment and safety

- Backend configuration points to local MongoDB at `localhost:27017` and database `invoiceiq`; the listener was reachable during this audit. Its data ownership/isolation is unknown, so no registration, invoice upload, CRUD, or other write tests are run against it.
- Backend startup requires `JWT_SECRET`. This audit used a temporary non-production test value only for the Maven process; no real secret was read or printed.
- Gemini extraction and insights can transmit invoice text/financial fields to Google. Do not invoke paid/provider APIs in the automated suite. Use injected clients or mocked responses for deterministic tests.
- OCR depends on Tesseract language data at `InvoiceIQ_Backend/tessdata`; real OCR fixtures should be harmless, known-value fixtures.
- Do not use existing user accounts, existing invoice files, or the configured local database for write integration tests. Use a disposable MongoDB instance/database and temporary upload directory first.
- Tests that require two principals, persistence, OCR, filesystem behavior, concurrency, or provider boundaries require isolated test fixtures and cleanup that is scoped only to the test-owned data.

## Test inventory and strategy

1. **Build and static checks:** Maven test/build, frontend lint and production build. Report compiler/build success separately from behavioral correctness.
2. **Authentication and authorization:** service/controller tests for registration validation, normalized email, same login failure response, BCrypt, JWT signature/expiry, intended public routes, protected routes, and user scoping. Follow with HTTP tests against isolated MongoDB and two test users.
3. **Invoice authorization:** verify that every invoice operation (read/list/search/update/delete/confirm/revalidate/duplicate review/download/insights) is scoped by authenticated user; forge client `userId` and server-managed fields in tests.
4. **Upload/storage/OCR:** unit-test safe signature/extension/size cases; use generated harmless PDF/PNG/JPEG fixtures and a temporary directory. Test cleanup on all failure points and document ownership checks. Verify PDF page and image pixel limits.
5. **Extraction and validation:** mock the provider transport. Cover empty/malformed/provider-error results, bounded OCR text, untrusted prompt content, null and non-finite values, missing fields, financial arithmetic/tolerance rules, and invalid confirmation. Never call paid Gemini in CI.
6. **Domain behavior:** test invoice state transitions, duplicates, invoice-backed Expenses, dashboard and analytics calculations using isolated repositories/fixtures.
7. **Frontend:** lint and production build first. Add component/API tests using an existing test framework if found; otherwise evaluate Vitest + Testing Library as a compatible option. Add browser E2E only after an isolated backend and deterministic OCR/AI doubles exist.
8. **Production readiness:** inspect configuration/secrets, CORS, response/log redaction, file persistence/backup, database indexes and isolation, monitoring, resource limits, deployment profiles, and provider disclosure requirements.

## Current tool coverage

- Backend: JUnit 5/Spring test dependencies are present. Mockito may be available through Spring test dependencies, but confirm the resolved dependency graph before adding tests. No integration test database/container setup was found in the initial inventory.
- Frontend: scripts are `dev`, `build`, `lint`, and `preview`. No frontend test script or test framework is declared.
- End-to-end: no browser automation framework is declared.

## Risks and dependencies

- `invoiceiq` may contain user data; no write or destructive integration tests are allowed until a disposable database is explicitly isolated.
- Gemini calls may incur cost and disclose invoice data; mocks are required for normal automated runs.
- Native OCR availability and fixture quality affect reproducibility.
- The existing backend context test may connect to the configured MongoDB. Keep test invocations read-only unless test configuration is changed to an isolated database.
- Source review has already identified an invoice-delete/file-cleanup gap for validation by a future isolated regression test.

## Proposed execution order

1. Repository/build discovery and safe read-only smoke checks (current milestone).
2. Backend unit tests and application build; add focused tests around JWT/auth and invoice ownership.
3. Resolve frontend lint failures; add suitable UI/service tests.
4. Set up isolated MongoDB and temporary storage test configuration.
5. Test upload, OCR, validation, invoice lifecycle, duplicates, Expenses, dashboard and analytics.
6. Test AI extraction/insights with mocked provider responses; assess production provider configuration separately.
7. Run isolated two-user API/E2E checks, then complete production-readiness review.

## Initial non-goals

This first pass does not mutate configured MongoDB data, delete uploads, register accounts, make external AI calls, or claim full production certification.
