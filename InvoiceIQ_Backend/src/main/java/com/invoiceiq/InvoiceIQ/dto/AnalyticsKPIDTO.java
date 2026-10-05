package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsKPIDTO {

    private double totalSpending;

    private double averageMonthlySpending;

    private String topSpendingCategory;

    private String topVendor;

    private long transactionCount;
}