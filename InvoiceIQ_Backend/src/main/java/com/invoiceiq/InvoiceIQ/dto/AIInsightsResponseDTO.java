package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightsResponseDTO {

    private String summary;

    private List<String> spendingInsights;

    private List<String> recommendations;

    private String topCategory;

    private String topVendor;

    private double totalSpending;

    private double monthlySpending;

    private int totalInvoices;
}