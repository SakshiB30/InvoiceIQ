package com.invoiceiq.InvoiceIQ.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    private final Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() throws IOException {
        Files.createDirectories(uploadDirectory);
    }

    public String storeFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Uploaded file must not be empty"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File size exceeds the maximum allowed limit of 10 MB"
            );
        }

        String detectedExtension = detectFileExtension(file);

        String originalFileName = file.getOriginalFilename();

        String safeFileName = originalFileName == null
                ? ""
                : Paths.get(originalFileName.replace('\\', '/'))
                .getFileName()
                .toString();

        String suppliedExtension = "";

        int dotIndex = safeFileName.lastIndexOf('.');

        if (dotIndex >= 0) {
            suppliedExtension = safeFileName
                    .substring(dotIndex)
                    .toLowerCase(Locale.ROOT);
        }

        if (!suppliedExtension.isEmpty()
                && !isAllowedExtension(suppliedExtension)) {
            throw new IllegalArgumentException(
                    "Unsupported file extension"
            );
        }

        if (!suppliedExtension.isEmpty()
                && !suppliedExtension.equals(detectedExtension)) {
            throw new IllegalArgumentException(
                    "File extension does not match the actual file content"
            );
        }

        String storedFileName =
                UUID.randomUUID() + detectedExtension;

        Path targetLocation =
                uploadDirectory.resolve(storedFileName).normalize();

        if (!targetLocation.startsWith(uploadDirectory)) {
            throw new IOException("Invalid file storage path");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation);
        }

        return targetLocation.toString();
    }

    private String detectFileExtension(MultipartFile file)
            throws IOException {

        byte[] header = new byte[8];

        int bytesRead;

        try (InputStream inputStream = file.getInputStream()) {
            bytesRead = inputStream.read(header);
        }

        // PNG signature
        if (bytesRead >= 8
                && (header[0] & 0xFF) == 0x89
                && header[1] == 0x50
                && header[2] == 0x4E
                && header[3] == 0x47
                && header[4] == 0x0D
                && header[5] == 0x0A
                && header[6] == 0x1A
                && header[7] == 0x0A) {
            return ".png";
        }

        // JPEG signature
        if (bytesRead >= 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF) {
            return ".jpg";
        }

        // PDF signature
        if (bytesRead >= 5
                && header[0] == '%'
                && header[1] == 'P'
                && header[2] == 'D'
                && header[3] == 'F'
                && header[4] == '-') {
            return ".pdf";
        }

        throw new IllegalArgumentException(
                "Unsupported file content. Upload a valid PDF, JPEG, or PNG file"
        );
    }

    private boolean isAllowedExtension(String extension) {
        return extension.equals(".pdf")
                || extension.equals(".png")
                || extension.equals(".jpg")
                || extension.equals(".jpeg");
    }

    public Path resolveStoredFile(String storedPath) throws IOException {

        if (storedPath == null || storedPath.isBlank()) {
            throw new IOException("Stored file path is missing");
        }

        Path requestedPath = Paths.get(storedPath)
                .toAbsolutePath()
                .normalize();

        if (!requestedPath.startsWith(uploadDirectory)
                || requestedPath.equals(uploadDirectory)) {
            throw new IOException("Invalid stored file path");
        }

        if (!Files.isRegularFile(requestedPath)) {
            throw new IOException("Stored file does not exist");
        }

        return requestedPath;
    }
}
