package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySpendingDTO {

    private String month;

    private double amount;
}