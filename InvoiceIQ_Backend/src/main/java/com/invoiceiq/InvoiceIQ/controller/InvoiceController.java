package com.invoiceiq.InvoiceIQ.controller;

import com.invoiceiq.InvoiceIQ.dto.AIInsightsResponseDTO;
import com.invoiceiq.InvoiceIQ.dto.InvoiceProcessingResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.service.AIExtractionService;
import com.invoiceiq.InvoiceIQ.service.AIInsightsService;
import com.invoiceiq.InvoiceIQ.service.InvoiceProcessingService;
import com.invoiceiq.InvoiceIQ.service.InvoiceService;
import com.invoiceiq.InvoiceIQ.service.InvoiceValidationService;
import com.invoiceiq.InvoiceIQ.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.invoiceiq.InvoiceIQ.entity.SourceDocument;
import com.invoiceiq.InvoiceIQ.service.FileStorageService;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    private final SecurityUtil securityUtil;

    private final InvoiceProcessingService invoiceProcessingService;

    private final AIInsightsService aiInsightsService;

    private final FileStorageService fileStorageService;

    private static final Logger logger =
            LoggerFactory.getLogger(InvoiceController.class);

    public InvoiceController(
            InvoiceService invoiceService,
            SecurityUtil securityUtil,
            InvoiceProcessingService invoiceProcessingService,
            AIInsightsService aiInsightsService,
            FileStorageService fileStorageService
    ) {
        this.invoiceService =
                invoiceService;

        this.securityUtil =
                securityUtil;

        this.invoiceProcessingService =
                invoiceProcessingService;

        this.aiInsightsService =
                aiInsightsService;

        this.fileStorageService =
                fileStorageService;
    }


    @PostMapping
    public ResponseEntity<Invoice> createInvoice(
            @RequestBody Invoice invoice
    ) {
        String userId =
                securityUtil.getCurrentUserId();


        Invoice savedInvoice =
                invoiceService.createInvoice(
                        invoice,
                        userId
                );


        return ResponseEntity.ok(
                savedInvoice
        );
    }


    @GetMapping
    public ResponseEntity<List<Invoice>> getInvoices(
            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            LocalDate fromDate,

            @RequestParam(required = false)
            LocalDate toDate
    ) {
        String userId =
                securityUtil.getCurrentUserId();


        return ResponseEntity.ok(
                invoiceService.getUserInvoices(
                        userId,
                        search,
                        category,
                        fromDate,
                        toDate
                )
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(
            @PathVariable String id
    ) {
        String userId =
                securityUtil.getCurrentUserId();


        return ResponseEntity.ok(
                invoiceService.getInvoiceById(
                        id,
                        userId
                )
        );
    }


    /*
     * Update an existing invoice.
     *
     * Only user-editable fields are updated
     * inside InvoiceService.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable String id,

            @RequestBody Invoice updatedInvoice
    ) {
        String userId =
                securityUtil.getCurrentUserId();


        Invoice updated =
                invoiceService.updateInvoice(
                        id,
                        userId,
                        updatedInvoice
                );


        return ResponseEntity.ok(
                updated
        );
    }


    /*
     * Re-validate an invoice after
     * the user has edited it.
     */
    @PutMapping("/{id}/validate")
    public ResponseEntity<Invoice> revalidateInvoice(
            @PathVariable String id
    ) {
        String userId =
                securityUtil.getCurrentUserId();


        Invoice validatedInvoice =
                invoiceService.revalidateInvoice(
                        id,
                        userId
                );


        return ResponseEntity.ok(
                validatedInvoice
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvoice(
            @PathVariable String id
    ) {
        String userId =
                securityUtil.getCurrentUserId();


        invoiceService.deleteInvoice(
                id,
                userId
        );


        return ResponseEntity.ok(
                "Invoice deleted successfully"
        );
    }


    @PostMapping("/upload")
    public ResponseEntity<InvoiceProcessingResponseDTO> uploadInvoice(
            @RequestParam("file")
            MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .build();
        }


        String contentType =
                file.getContentType();


        if (
                contentType == null
                        ||
                        (
                                !contentType.equals(
                                        "application/pdf"
                                )

                                        &&

                                        !contentType.equals(
                                                "image/jpeg"
                                        )

                                        &&

                                        !contentType.equals(
                                                "image/png"
                                        )
                        )
        ) {
            return ResponseEntity.badRequest()
                    .build();
        }


        try {

            String userId =
                    securityUtil.getCurrentUserId();


            InvoiceProcessingResponseDTO response =
                    invoiceProcessingService.processInvoice(
                            file,
                            userId
                    );


            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {
            logger.error("Invoice upload failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<byte[]> getInvoiceDocument(
            @PathVariable String id
    ) {
        String userId = securityUtil.getCurrentUserId();

        // Step 1: Verify that this invoice belongs to the logged-in user.
        Invoice invoice;

        try {
            invoice = invoiceService.getInvoiceById(id, userId);
        } catch (org.springframework.web.server.ResponseStatusException e) {
            if (e.getStatusCode().value() == 404) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }

        // Step 2: Get the stored document metadata.
        SourceDocument document = invoice.getSourceDocument();

        if (document == null
                || document.getStorageUrl() == null
                || document.getStorageUrl().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        // Step 3: Allow only the file types supported by InvoiceIQ.
        String fileType = document.getFileType();
        MediaType mediaType;

        if ("application/pdf".equalsIgnoreCase(fileType)) {
            mediaType = MediaType.APPLICATION_PDF;
        } else if ("image/png".equalsIgnoreCase(fileType)) {
            mediaType = MediaType.IMAGE_PNG;
        } else if ("image/jpeg".equalsIgnoreCase(fileType)) {
            mediaType = MediaType.IMAGE_JPEG;
        } else {
            return ResponseEntity.badRequest().build();
        }

        // Step 4: Resolve the stored path and read the file safely.
        try {
            Path filePath =
                    fileStorageService.resolveStoredFile(document.getStorageUrl());

            byte[] fileBytes = Files.readAllBytes(filePath);

            // Step 5: Use a safe fallback filename if metadata is missing.
            String fileName = document.getFileName();

            if (fileName == null || fileName.isBlank()) {
                fileName = "invoice-document";
            }

            ContentDisposition disposition = ContentDisposition
                    .inline()
                    .filename(fileName, StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            disposition.toString()
                    )
                    .header("X-Content-Type-Options", "nosniff")
                    .body(fileBytes);

        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmInvoice(
            @PathVariable String id
    ) {
        String userId =
                securityUtil.getCurrentUserId();

        try {
            Invoice confirmedInvoice =
                    invoiceService.confirmInvoice(
                            id,
                            userId
                    );

            return ResponseEntity.ok(
                    confirmedInvoice
            );

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/duplicate-review")
    public ResponseEntity<?> reviewDuplicate(
            @PathVariable String id,
            @RequestBody java.util.Map<String, String> request
    ) {
        String userId = securityUtil.getCurrentUserId();

        try {
            String decision = request.get("decision");

            Invoice reviewedInvoice = invoiceService.reviewDuplicate(
                    id,
                    userId,
                    decision
            );

            return ResponseEntity.ok(reviewedInvoice);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/ai-insights")
    public ResponseEntity<AIInsightsResponseDTO> getAIInsights() {

        String userId =
                securityUtil.getCurrentUserId();


        List<Invoice> invoices =
                invoiceService.getUserInvoices(
                        userId,
                        null,
                        null,
                        null,
                        null
                );


        AIInsightsResponseDTO insights =
                aiInsightsService.generateInsights(
                        invoices
                );


        return ResponseEntity.ok(
                insights
        );
    }


}
