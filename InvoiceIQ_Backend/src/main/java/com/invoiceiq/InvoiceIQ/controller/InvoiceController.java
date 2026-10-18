package com.invoiceiq.InvoiceIQ.controller;

import com.invoiceiq.InvoiceIQ.dto.AIInsightsResponseDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.InvoiceProcessingResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import com.invoiceiq.InvoiceIQ.service.AIExtractionService;
import com.invoiceiq.InvoiceIQ.service.AIInsightsService;
import com.invoiceiq.InvoiceIQ.service.InvoiceProcessingService;
import com.invoiceiq.InvoiceIQ.service.InvoiceService;
import com.invoiceiq.InvoiceIQ.service.InvoiceValidationService;
import com.invoiceiq.InvoiceIQ.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    private final SecurityUtil securityUtil;

    private final InvoiceProcessingService invoiceProcessingService;

    private final AIExtractionService aiExtractionService;

    private final InvoiceValidationService invoiceValidationService;

    private final AIInsightsService aiInsightsService;


    public InvoiceController(
            InvoiceService invoiceService,
            SecurityUtil securityUtil,
            InvoiceProcessingService invoiceProcessingService,
            AIExtractionService aiExtractionService,
            InvoiceValidationService invoiceValidationService,
            AIInsightsService aiInsightsService
    ) {
        this.invoiceService =
                invoiceService;

        this.securityUtil =
                securityUtil;

        this.invoiceProcessingService =
                invoiceProcessingService;

        this.aiExtractionService =
                aiExtractionService;

        this.invoiceValidationService =
                invoiceValidationService;

        this.aiInsightsService =
                aiInsightsService;
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

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    @PostMapping("/ai-test")
    public ResponseEntity<ExtractedInvoiceDTO> testAIExtraction(
            @RequestBody String rawText
    ) {
        System.out.println(
                "========== AI TEST ENDPOINT CALLED =========="
        );


        System.out.println(
                "RAW TEXT:"
        );


        System.out.println(
                rawText
        );


        ExtractedInvoiceDTO result =
                aiExtractionService.extractInvoiceData(
                        rawText
                );


        System.out.println(
                "AI TEST RESULT:"
        );


        System.out.println(
                result
        );


        System.out.println(
                "========== AI TEST ENDPOINT FINISHED =========="
        );


        return ResponseEntity.ok(
                result
        );
    }


    @GetMapping("/security-test")
    public ResponseEntity<String> securityTest() {

        System.out.println(
                "========== SECURITY TEST CONTROLLER REACHED =========="
        );


        return ResponseEntity.ok(
                "Security test successful"
        );
    }


    @PostMapping("/validation-test")
    public ResponseEntity<ValidationResult> testValidation(
            @RequestBody ExtractedInvoiceDTO invoice
    ) {
        ValidationResult result =
                invoiceValidationService.validate(
                        invoice
                );


        return ResponseEntity.ok(
                result
        );
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
