package com.invoiceiq.InvoiceIQ.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    private String name;

    private String gstin;
}