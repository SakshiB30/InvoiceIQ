package com.invoiceiq.InvoiceIQ.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "invoices")
public class Invoice {

    @Id
    private String id;

    private String userId;

    private Vendor vendor;

    private String invoiceNumber;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private List<InvoiceItem> items;

    private double subtotal;

    private double tax;

    private double totalAmount;

    private String category;

    private String processingStatus;

    private ValidationResult validation;

    private DuplicateResult duplicate;

    private SourceDocument sourceDocument;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}