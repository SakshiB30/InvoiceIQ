package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class InvoiceProcessingService {

    private final FileStorageService fileStorageService;
    private final OCRService ocrService;
    private final AIExtractionService aiExtractionService;

    public InvoiceProcessingService(
            FileStorageService fileStorageService,
            OCRService ocrService,
            AIExtractionService aiExtractionService
    ) {
        this.fileStorageService = fileStorageService;
        this.ocrService = ocrService;
        this.aiExtractionService = aiExtractionService;
    }

    public ExtractedInvoiceDTO processInvoice(
            MultipartFile file
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

            // Step 4: Return structured invoice data
            return extractedInvoice;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to process invoice file",
                    e
            );
        }
    }
}