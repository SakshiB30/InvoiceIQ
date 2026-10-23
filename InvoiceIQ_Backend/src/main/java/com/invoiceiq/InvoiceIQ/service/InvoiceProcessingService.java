package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.InvoiceProcessingResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.DuplicateResult;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.SourceDocument;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
public class InvoiceProcessingService {

    private static final Logger logger =
            LoggerFactory.getLogger(InvoiceProcessingService.class);

    private final FileStorageService fileStorageService;
    private final OCRService ocrService;
    private final AIExtractionService aiExtractionService;
    private final InvoiceValidationService invoiceValidationService;
    private final InvoiceMapperService invoiceMapperService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final InvoiceService invoiceService;
    private final CategorizationService categorizationService;

    public InvoiceProcessingResponseDTO processInvoice(
            MultipartFile file,
            String userId
    ) {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please upload a non-empty file"
            );
        }

        String filePath = null;
        boolean invoiceSaved = false;

        try {
            // Step 1: Validate and store the uploaded file.
            filePath = fileStorageService.storeFile(file);

            // Step 2: Extract raw text using OCR.
            String extractedText = ocrService.extractText(filePath);

            if (extractedText == null || extractedText.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "No readable text could be extracted from the document"
                );
            }

            // Step 3: Extract invoice data using AI.
            ExtractedInvoiceDTO extractedInvoice =
                    aiExtractionService.extractInvoiceData(extractedText);

            if (extractedInvoice == null) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "Invoice data could not be extracted from the document"
                );
            }

            // Step 4: Validate extracted invoice data.
            ValidationResult validationResult =
                    invoiceValidationService.validate(extractedInvoice);

            // Step 5: Map extracted data to an invoice.
            Invoice invoice =
                    invoiceMapperService.mapToInvoice(extractedInvoice, userId);

            // Step 6: Attach original document metadata.
            SourceDocument sourceDocument = new SourceDocument();

            sourceDocument.setFileName(
                    sanitizeOriginalFileName(file.getOriginalFilename())
            );

            sourceDocument.setFileType(
                    determineStoredFileType(filePath)
            );

            sourceDocument.setStorageUrl(filePath);

            invoice.setSourceDocument(sourceDocument);

            // Step 7: Set the initial processing status.
            invoice.setProcessingStatus("REVIEW_REQUIRED");

            // Step 8: Categorize the invoice.
            String category = categorizationService.categorize(invoice);
            invoice.setCategory(category);

            // Step 9: Attach validation results.
            invoice.setValidation(validationResult);

            // Step 10: Check for duplicates.
            DuplicateResult duplicateResult =
                    duplicateDetectionService.checkDuplicate(invoice, userId);

            invoice.setDuplicate(duplicateResult);

            // Step 11: Save the invoice.
            Invoice savedInvoice = invoiceService.createInvoice(invoice, userId);
            invoiceSaved = true;

            logger.info(
                    "Invoice processed successfully. invoiceId={}, userId={}",
                    savedInvoice.getId(),
                    userId
            );

            // Step 12: Return the processing result.
            return new InvoiceProcessingResponseDTO(
                    extractedInvoice,
                    validationResult,
                    duplicateResult,
                    savedInvoice.getId()
            );

        } catch (ResponseStatusException exception) {
            cleanupUploadedFile(filePath);
            throw exception;

        } catch (IllegalArgumentException exception) {
            cleanupUploadedFile(filePath);

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    exception.getMessage(),
                    exception
            );

        } catch (Exception exception) {
            cleanupUploadedFile(filePath);

            logger.error(
                    "Invoice processing failed for userId={}",
                    userId,
                    exception
            );

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "The uploaded document could not be processed",
                    exception
            );
        }
    }

    private String sanitizeOriginalFileName(String originalFileName) {
        if (originalFileName == null || originalFileName.isBlank()) {
            return "uploaded-document";
        }

        String normalized = originalFileName.replace('\\', '/');
        String fileName = normalized.substring(
                normalized.lastIndexOf('/') + 1
        );

        // Avoid storing control characters in the displayed filename.
        return fileName.replaceAll("[\\p{Cntrl}]", "");
    }

    private String determineStoredFileType(String filePath) {
        String lowerCasePath = filePath.toLowerCase();

        if (lowerCasePath.endsWith(".pdf")) {
            return "application/pdf";
        }

        if (lowerCasePath.endsWith(".png")) {
            return "image/png";
        }

        if (lowerCasePath.endsWith(".jpg")
                || lowerCasePath.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        return "application/octet-stream";
    }

    private void cleanupUploadedFile(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return;
        }

        try {
            Path storedFile =
                    fileStorageService.resolveStoredFile(filePath);

            Files.deleteIfExists(storedFile);

        } catch (IOException exception) {
            logger.warn(
                    "Could not clean up uploaded file after processing failure"
            );
        }
    }
}
