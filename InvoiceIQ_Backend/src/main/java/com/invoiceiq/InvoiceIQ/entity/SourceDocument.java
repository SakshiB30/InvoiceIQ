package com.invoiceiq.InvoiceIQ.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SourceDocument {

    private String fileName;

    private String fileType;

    private String storageUrl;
}