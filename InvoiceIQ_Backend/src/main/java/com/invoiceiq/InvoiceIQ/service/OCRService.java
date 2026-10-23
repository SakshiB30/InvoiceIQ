package com.invoiceiq.InvoiceIQ.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.rendering.ImageType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class OCRService {

    private static final Logger logger =
            LoggerFactory.getLogger(OCRService.class);

    private static final int MAX_PDF_PAGES = 20;
    private static final float PDF_RENDER_DPI = 150.0f;

    private final Path tessDataPath;

    public OCRService(
            @Value("${invoice.ocr.tessdata-path:tessdata}")
            String tessDataDirectory
    ) {
        this.tessDataPath = Paths.get(tessDataDirectory)
                .toAbsolutePath()
                .normalize();
    }

    public String extractText(String filePath) {

        if (filePath == null || filePath.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The document path is missing"
            );
        }

        final Path documentPath;

        try {
            documentPath = Paths.get(filePath)
                    .toAbsolutePath()
                    .normalize();
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid document path"
            );
        }

        if (!Files.isRegularFile(documentPath)
                || !Files.isReadable(documentPath)) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "The uploaded document is missing or unreadable"
            );
        }

        if (!Files.isDirectory(tessDataPath)
                || !Files.isReadable(tessDataPath)) {
            logger.error(
                    "Tesseract data directory is unavailable: {}",
                    tessDataPath
            );

            throw new IllegalStateException(
                    "OCR service is not configured correctly"
            );
        }

        String extension = getExtension(documentPath);

        try {
            String extractedText;

            switch (extension) {
                case ".pdf" ->
                        extractedText = extractTextFromPdf(documentPath);

                case ".png", ".jpg", ".jpeg" ->
                        extractedText = extractTextFromImage(documentPath);

                default ->
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Unsupported document format"
                        );
            }

            if (extractedText == null || extractedText.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "No readable text was found in the document"
                );
            }

            return extractedText.trim();

        } catch (ResponseStatusException exception) {
            throw exception;

        } catch (IOException exception) {
            logger.warn(
                    "Unable to read document for OCR: {}",
                    documentPath.getFileName(),
                    exception
            );

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "The document is corrupted or could not be read",
                    exception
            );

        } catch (TesseractException exception) {
            logger.warn(
                    "Tesseract OCR failed for document: {}",
                    documentPath.getFileName(),
                    exception
            );

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Unable to extract text from the document",
                    exception
            );

        } catch (Exception exception) {
            logger.error(
                    "Unexpected OCR failure for document: {}",
                    documentPath.getFileName(),
                    exception
            );

            throw new IllegalStateException(
                    "OCR processing failed",
                    exception
            );
        }
    }

    private String extractTextFromImage(Path imagePath)
            throws IOException, TesseractException {

        BufferedImage image = javax.imageio.ImageIO.read(
                imagePath.toFile()
        );

        if (image == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "The uploaded image is invalid or unsupported"
            );
        }

        // Reject extremely large decoded images before OCR.
        long pixelCount = (long) image.getWidth() * image.getHeight();

        if (pixelCount > 20_000_000L) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "Image dimensions exceed the allowed processing limit"
            );
        }

        return createTesseract().doOCR(image);
    }

    private String extractTextFromPdf(Path pdfPath)
            throws IOException, TesseractException {

        StringBuilder extractedText = new StringBuilder();

        try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {

            int pageCount = document.getNumberOfPages();

            if (pageCount == 0) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "The PDF contains no pages"
                );
            }

            if (pageCount > MAX_PDF_PAGES) {
                throw new ResponseStatusException(
                        HttpStatus.PAYLOAD_TOO_LARGE,
                        "PDF exceeds the maximum allowed limit of "
                                + MAX_PDF_PAGES + " pages"
                );
            }

            PDFRenderer renderer = new PDFRenderer(document);
            renderer.setSubsamplingAllowed(true);

            Tesseract tesseract = createTesseract();

            for (int pageIndex = 0; pageIndex < pageCount; pageIndex++) {

                BufferedImage pageImage = renderer.renderImageWithDPI(
                        pageIndex,
                        PDF_RENDER_DPI,
                        ImageType.GRAY
                );

                try {
                    long pixelCount =
                            (long) pageImage.getWidth() * pageImage.getHeight();

                    if (pixelCount > 20_000_000L) {
                        throw new ResponseStatusException(
                                HttpStatus.PAYLOAD_TOO_LARGE,
                                "A PDF page exceeds the allowed rendering dimensions"
                        );
                    }

                    String pageText = tesseract.doOCR(pageImage);

                    if (pageText != null && !pageText.isBlank()) {
                        if (!extractedText.isEmpty()) {
                            extractedText.append("\n\n");
                        }

                        extractedText.append(pageText.trim());
                    }
                } finally {
                    pageImage.flush();
                }
            }
        }

        return extractedText.toString();
    }

    private Tesseract createTesseract() {

        Tesseract tesseract = new Tesseract();

        tesseract.setDatapath(tessDataPath.toString());
        tesseract.setLanguage("eng");

        return tesseract;
    }

    private String getExtension(Path path) {

        String fileName = path.getFileName()
                .toString()
                .toLowerCase(java.util.Locale.ROOT);

        int dotIndex = fileName.lastIndexOf('.');

        if (dotIndex < 0) {
            return "";
        }

        return fileName.substring(dotIndex);
    }
}