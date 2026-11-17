package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedInvoiceDTO {

    private String vendorName;

    private String gstin;

    private String invoiceNumber;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private List<ExtractedInvoiceItemDTO> items;

    private Double subtotal;

    private Double tax;

    private Double totalAmount;

    // New field
    private String documentType;

    // Backward-compatible constructor
    public ExtractedInvoiceDTO(
            String vendorName,
            String gstin,
            String invoiceNumber,
            LocalDate invoiceDate,
            LocalDate dueDate,
            List<ExtractedInvoiceItemDTO> items,
            Double subtotal,
            Double tax,
            Double totalAmount
    ) {
        this.vendorName = vendorName;
        this.gstin = gstin;
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.totalAmount = totalAmount;
        this.documentType = "OTHER";
    }
}