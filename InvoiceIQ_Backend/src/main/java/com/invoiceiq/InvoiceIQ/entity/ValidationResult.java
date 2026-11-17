package com.invoiceiq.InvoiceIQ.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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

    // Non-critical issues or optional information
    private List<String> warnings = new ArrayList<>();

    // Whether expectedTotal was independently calculated
    private boolean totalVerificationPossible;

    // Backward-compatible constructor
    public ValidationResult(
            boolean valid,
            boolean totalMismatch,
            double expectedTotal,
            double extractedTotal,
            List<String> missingFields
    ) {
        this.valid = valid;
        this.totalMismatch = totalMismatch;
        this.expectedTotal = expectedTotal;
        this.extractedTotal = extractedTotal;
        this.missingFields = missingFields;
        this.warnings = new ArrayList<>();
        this.totalVerificationPossible = true;
    }
}