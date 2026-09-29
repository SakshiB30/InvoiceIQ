package com.invoiceiq.InvoiceIQ.service;

import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OCRService {

    private final String tessDataPath =
            "tessdata";

    public String extractText(String filePath) {

        try {

            Tesseract tesseract = new Tesseract();

            tesseract.setDatapath(tessDataPath);

            tesseract.setLanguage("eng");

            File file = new File(filePath);

            return tesseract.doOCR(file);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to extract text from invoice",
                    e
            );
        }
    }
}