package com.invoiceiq.InvoiceIQ.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidationResult {

    private boolean valid;

    private boolean totalMismatch;

    private double expectedTotal;

    private double extractedTotal;

    private List<String> missingFields;
}