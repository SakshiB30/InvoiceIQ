# InvoiceIQ — Project Overview

## 1. Project Summary

InvoiceIQ is an AI-assisted invoice management and financial intelligence platform designed for small businesses.

The application enables users to manage invoices, extract invoice information using OCR and AI, validate financial data, identify potential duplicate invoices, and analyze business spending.

The goal is to reduce manual invoice processing, improve financial record accuracy, and provide useful insights into business expenditure.

## 2. Technology Stack

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router
* Axios
* Recharts

### Backend

* Java
* Spring Boot
* Spring Security
* JWT-based authentication

### Database

* MongoDB

### Document Processing

* Tesseract OCR through Tess4J
* AI-assisted invoice extraction using Google Gemini API

Important: Confirm exact library versions, configuration details, and dependencies from the source code before documenting them.

## 3. Core Features

The following features have been reported as implemented. Their current source-code status must be verified.

1. User registration and login.
2. JWT authentication.
3. Protected frontend routes.
4. User profile management.
5. Invoice upload.
6. OCR text extraction.
7. AI-assisted invoice data extraction.
8. Financial validation.
9. Duplicate invoice detection.
10. Invoice confirmation and persistence.
11. Invoice CRUD operations.
12. Invoice document retrieval.
13. Invoice-backed Expenses page.
14. Expense search and category filtering.
15. Expense date filtering.
16. Dashboard.
17. Financial analytics.
18. AI-generated spending insights.
19. Profile and preferences screens.

Do not interpret this list as independent verification that every feature currently works.

## 4. Architectural Decisions

### 4.1 Expenses Are Invoice-Backed

The Expenses page is a frontend view built from existing invoice data.

It does not currently use a separate Expense entity or dedicated Expenses database collection.

The frontend uses an expense service and Redux slice to work with the existing invoice API.

Expense search, category filters, date filters, summary cards, and expense records are derived from invoice information.

Selecting an expense opens the corresponding invoice details.

Preserve this architecture unless a specific requirement justifies introducing a separate Expense entity.

### 4.2 Authentication and User Data Isolation

The application uses Spring Security and JWT authentication.

Authenticated API operations must enforce appropriate authorization and prevent users from accessing other users' private invoice data.

Verify authorization rules against the actual backend implementation and tests before making security claims.

### 4.3 Invoice Processing Workflow

The intended invoice workflow is:

1. A user uploads an invoice document.
2. The backend processes the document.
3. OCR extracts text from the document.
4. AI-assisted processing extracts structured invoice information.
5. Financial validation checks the extracted data.
6. Duplicate detection evaluates whether the invoice may already exist.
7. The user confirms the invoice when appropriate.
8. Confirmed invoice data is persisted.
9. Invoice information is used by the dashboard, Expenses page, and analytics features.

The exact processing sequence and failure-handling behavior must be confirmed from the source code.

## 5. Main Application Areas

### Authentication

* Registration
* Login
* JWT handling
* Protected routes

### Invoice Management

* Upload
* OCR and AI extraction
* Financial validation
* Duplicate detection
* Confirmation and persistence
* Invoice CRUD
* Document retrieval

### Expenses

* Invoice-backed expense listing
* Search
* Category filtering
* Date filtering
* Expense summaries
* Navigation to invoice details

### Dashboard and Analytics

* Financial summaries
* Spending analytics
* Charts
* AI-generated spending insights

### User Profile and Preferences

* Profile management
* Application preferences

The persistence behavior of user preferences must be verified.

## 6. Previously Reported Test Results

The developer previously reported successful completion of these production-readiness checks:

* Invoice confirmation and persistence.
* Expenses integration: six checks.
* Duplicate detection: five checks.
* User data isolation: six checks using two test accounts.
* Error handling: five checks.

These are historical reports, not independently verified results in this documentation session.

Record the test commands, environment, observed output, and date when the checks are independently rerun.

## 7. Known Improvement Areas

The following areas require assessment against the existing implementation:

* Security hardening and environment configuration.
* File upload validation.
* OCR and AI extraction reliability.
* Financial validation edge cases.
* Duplicate detection accuracy.
* Automated test coverage.
* Consistency of analytics calculations.
* File storage and backup strategy.
* API error handling.
* Backend-persisted preferences.
* CSV and PDF exports.
* Notifications.
* Deployment and monitoring.

These are assessment areas, not assertions that every listed feature is missing.

## 8. Development Principles

1. Inspect existing code before proposing changes.
2. Preserve working functionality.
3. Avoid duplicating exist
