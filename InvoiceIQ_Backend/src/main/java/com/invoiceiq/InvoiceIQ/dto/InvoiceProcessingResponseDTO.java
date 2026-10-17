package com.invoiceiq.InvoiceIQ.dto;

import com.invoiceiq.InvoiceIQ.entity.DuplicateResult;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceProcessingResponseDTO {

    private ExtractedInvoiceDTO invoice;

    private ValidationResult validation;

    private DuplicateResult duplicate;

    private String savedInvoiceId;
}
