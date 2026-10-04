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
}
