package com.invoiceiq.InvoiceIQ.dto;

import com.invoiceiq.InvoiceIQ.entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    private long totalInvoices;

    private double totalExpenses;

    private Map<String, Double> categoryWiseExpenses;

    private Map<String, Double> vendorWiseExpenses;

    private Map<String, Double> monthlyExpenses;

    private List<Invoice> recentInvoices;
}