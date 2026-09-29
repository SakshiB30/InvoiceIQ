package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedInvoiceItemDTO {

    private String description;

    private Double quantity;

    private Double unitPrice;

    private Double amount;
}