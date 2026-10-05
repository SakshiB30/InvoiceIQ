package com.invoiceiq.InvoiceIQ.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponseDTO {

    private AnalyticsKPIDTO kpis;

    private AnalyticsComparisonDTO comparison;

    private List<MonthlySpendingDTO> monthlySpending;

    private List<CategorySpendingDTO> categorySpending;

    private List<VendorSpendingDTO> topVendors;
}
