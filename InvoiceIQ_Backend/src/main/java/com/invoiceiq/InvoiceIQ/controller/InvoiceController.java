package com.invoiceiq.InvoiceIQ.controller;

import com.invoiceiq.InvoiceIQ.dto.AIInsightsResponseDTO;
import com.invoiceiq.InvoiceIQ.dto.InvoiceProcessingResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.SourceDocument;
import com.invoiceiq.InvoiceIQ.service.AIInsightsService;
import com.invoiceiq.InvoiceIQ.service.FileStorageService;
import com.invoiceiq.InvoiceIQ.service.InvoiceProcessingService;
import com.invoiceiq.InvoiceIQ.service.InvoiceService;
import com.invoiceiq.InvoiceIQ.util.SecurityUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private static final Logger logger =
            LoggerFactory.getLogger(InvoiceController.class);

    private final InvoiceService invoiceService;
    private final SecurityUtil securityUtil;
    private final InvoiceProcessingService invoiceProcessingService;
    private final AIInsightsService aiInsightsService;
    private final FileStorageService fileStorageService;

    public InvoiceController(
            InvoiceService invoiceService,
            SecurityUtil securityUtil,
            InvoiceProcessingService invoiceProcessingService,
            AIInsightsService aiInsightsService,
            FileStorageService fileStorageService
    ) {
        this.invoiceService = invoiceService;
        this.securityUtil = securityUtil;
        this.invoiceProcessingService = invoiceProcessingService;
        this.aiInsightsService = aiInsightsService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(
            @RequestBody Invoice invoice
    ) {
        String userId = securityUtil.getCurrentUserId();

        // Accept only fields that users are allowed to set. Processing
        // status, validation, duplicate state, document metadata, IDs and
        // timestamps are managed by the server and must not be mass-assigned
        // from the request body.
        Invoice userEditableInvoice = new Invoice();
        userEditableInvoice.setVendor(invoice.getVendor());
        userEditableInvoice.setInvoiceNumber(invoice.getInvoiceNumber());
        userEditableInvoice.setInvoiceDate(invoice.getInvoiceDate());
        userEditableInvoice.setDueDate(invoice.getDueDate());
        userEditableInvoice.setItems(invoice.getItems());
        userEditableInvoice.setSubtotal(invoice.getSubtotal());
        userEditableInvoice.setTax(invoice.getTax());
        userEditableInvoice.setTotalAmount(invoice.getTotalAmount());
        userEditableInvoice.setCategory(invoice.getCategory());

        Invoice savedInvoice =
                invoiceService.createInvoice(userEditableInvoice, userId);

        return ResponseEntity.ok(savedInvoice);
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate
    ) {
        String userId = securityUtil.getCurrentUserId();

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
        String userId = securityUtil.getCurrentUserId();

        return ResponseEntity.ok(
                invoiceService.getInvoiceById(id, userId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable String id,
            @RequestBody Invoice updatedInvoice
    ) {
        String userId = securityUtil.getCurrentUserId();

        Invoice updated = invoiceService.updateInvoice(
                id,
                userId,
                updatedInvoice
        );

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/validate")
    public ResponseEntity<Invoice> revalidateInvoice(
            @PathVariable String id
    ) {
        String userId = securityUtil.getCurrentUserId();

        Invoice validatedInvoice =
                invoiceService.revalidateInvoice(id, userId);

        return ResponseEntity.ok(validatedInvoice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvoice(
            @PathVariable String id
    ) {
        String userId = securityUtil.getCurrentUserId();

        invoiceService.deleteInvoice(id, userId);

        return ResponseEntity.ok("Invoice deleted successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<InvoiceProcessingResponseDTO> uploadInvoice(
            @RequestParam("file") MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Uploaded file must not be empty"
            );
        }

        String userId = securityUtil.getCurrentUserId();

        // FileStorageService validates the actual file signature,
        // extension, and size before storing the document.
        InvoiceProcessingResponseDTO result =
                invoiceProcessingService.processInvoice(file, userId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<InputStreamResource> getInvoiceDocument(
            @PathVariable String id
    ) {
        String userId = securityUtil.getCurrentUserId();

        // Verify invoice ownership before accessing its document.
        Invoice invoice = invoiceService.getInvoiceById(id, userId);

        SourceDocument document = invoice.getSourceDocument();

        if (document == null
                || document.getStorageUrl() == null
                || document.getStorageUrl().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        String fileType = document.getFileType();
        MediaType mediaType;

        if ("application/pdf".equalsIgnoreCase(fileType)) {
            mediaType = MediaType.APPLICATION_PDF;
        } else if ("image/png".equalsIgnoreCase(fileType)) {
            mediaType = MediaType.IMAGE_PNG;
        } else if ("image/jpeg".equalsIgnoreCase(fileType)) {
            mediaType = MediaType.IMAGE_JPEG;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unsupported stored document type"
            );
        }

        try {
            Path filePath = fileStorageService.resolveStoredFile(
                    document.getStorageUrl()
            );

            InputStream inputStream = Files.newInputStream(filePath);

            String fileName = sanitizeDownloadFileName(
                    document.getFileName()
            );

            ContentDisposition disposition = ContentDisposition
                    .inline()
                    .filename(fileName, StandardCharsets.UTF_8)
                    .build();

            InputStreamResource resource =
                    new InputStreamResource(inputStream);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .contentLength(Files.size(filePath))
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            disposition.toString()
                    )
                    .header("X-Content-Type-Options", "nosniff")
                    .body(resource);

        } catch (IOException exception) {
            logger.warn(
                    "Unable to read stored invoice document for invoice ID {}",
                    id
            );

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Stored invoice document was not found"
            );
        }
    }

    private String sanitizeDownloadFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "invoice-document";
        }

        String normalized = fileName.replace('\\', '/');

        String safeName = normalized.substring(
                normalized.lastIndexOf('/') + 1
        );

        safeName = safeName.replaceAll("[\\p{Cntrl}]", "");

        return safeName.isBlank()
                ? "invoice-document"
                : safeName;
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Invoice> confirmInvoice(
            @PathVariable String id
    ) {
        String userId = securityUtil.getCurrentUserId();

        Invoice confirmedInvoice =
                invoiceService.confirmInvoice(id, userId);

        return ResponseEntity.ok(confirmedInvoice);
    }

    @PutMapping("/{id}/duplicate-review")
    public ResponseEntity<Invoice> reviewDuplicate(
            @PathVariable String id,
            @RequestBody Map<String, String> request
    ) {
        String userId = securityUtil.getCurrentUserId();

        if (request == null
                || request.get("decision") == null
                || request.get("decision").isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A duplicate-review decision is required"
            );
        }

        Invoice reviewedInvoice = invoiceService.reviewDuplicate(
                id,
                userId,
                request.get("decision")
        );

        return ResponseEntity.ok(reviewedInvoice);
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<AIInsightsResponseDTO> getAIInsights() {

        String userId = securityUtil.getCurrentUserId();

        List<Invoice> invoices = invoiceService.getUserInvoices(
                userId,
                null,
                null,
                null,
                null
        );

        AIInsightsResponseDTO insights =
                aiInsightsService.generateInsights(invoices);

        return ResponseEntity.ok(insights);
    }
}
