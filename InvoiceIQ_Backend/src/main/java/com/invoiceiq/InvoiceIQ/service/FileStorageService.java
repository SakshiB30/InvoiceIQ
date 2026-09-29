package com.invoiceiq.InvoiceIQ.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() throws IOException {

        Files.createDirectories(uploadDirectory);
    }

    public String storeFile(MultipartFile file) throws IOException {

        String originalFileName = file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null &&
                originalFileName.contains(".")) {

            extension = originalFileName.substring(
                    originalFileName.lastIndexOf(".")
            );
        }

        String storedFileName =
                UUID.randomUUID() + extension;

        Path targetLocation =
                uploadDirectory.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                targetLocation,
                StandardCopyOption.REPLACE_EXISTING
        );

        return targetLocation.toString();
    }
}