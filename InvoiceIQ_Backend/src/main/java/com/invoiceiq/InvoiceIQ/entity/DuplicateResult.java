package com.invoiceiq.InvoiceIQ.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateResult {

    private boolean potentialDuplicate;

    private String matchedInvoiceId;
}