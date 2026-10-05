package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsComparisonDTO {

    private Double previousTotalSpending;

    private Double spendingChangePercentage;

    private Long previousTransactionCount;

    private Double transactionChangePercentage;

    private Double previousAverageMonthlySpending;

    private Double averageMonthlySpendingChangePercentage;
}
