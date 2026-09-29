package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.InvoiceProcessingResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.DuplicateResult;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class InvoiceProcessingService {

    private final FileStorageService fileStorageService;
    private final OCRService ocrService;
    private final AIExtractionService aiExtractionService;
    private final InvoiceValidationService invoiceValidationService;
    private final InvoiceMapperService invoiceMapperService;
    private final DuplicateDetectionService duplicateDetectionService;

    public InvoiceProcessingResponseDTO processInvoice(
            MultipartFile file,
            String userId
    ) {

        try {

            // Step 1: Store the uploaded file
            String filePath =
                    fileStorageService.storeFile(file);

            // Step 2: Extract raw text using OCR
            String extractedText =
                    ocrService.extractText(filePath);

            // Step 3: Send OCR text to Gemini AI
            ExtractedInvoiceDTO extractedInvoice =
                    aiExtractionService.extractInvoiceData(
                            extractedText
                    );

            // Step 4: Validate extracted invoice data
            ValidationResult validationResult =
                    invoiceValidationService.validate(
                            extractedInvoice
                    );

            // Step 5: Convert DTO to Invoice entity
            Invoice invoice =
                    invoiceMapperService.mapToInvoice(
                            extractedInvoice,
                            userId
                    );

            // Step 6: Check for duplicate invoice
            DuplicateResult duplicateResult =
                    duplicateDetectionService.checkDuplicate(
                            invoice,
                            userId
                    );

            // Step 7: Attach duplicate result
            invoice.setDuplicate(duplicateResult);

            System.out.println(
                    "========== DUPLICATE CHECK =========="
            );

            System.out.println(duplicateResult);

            System.out.println(
                    "====================================="
            );

            // Step 8: Return extracted data,
            // validation result and duplicate result
            return new InvoiceProcessingResponseDTO(
                    extractedInvoice,
                    validationResult,
                    duplicateResult
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to process invoice file",
                    e
            );
        }
    }
}