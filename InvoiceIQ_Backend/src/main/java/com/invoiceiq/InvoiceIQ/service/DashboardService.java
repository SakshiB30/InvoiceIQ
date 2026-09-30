package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.DashboardResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InvoiceRepository invoiceRepository;

    public DashboardResponseDTO getDashboard(
            String userId
    ) {

        // Get all invoices belonging to the logged-in user
        List<Invoice> invoices =
                invoiceRepository.findByUserId(userId);

        // 1. Total invoices
        long totalInvoices =
                invoices.size();

        // 2. Total expenses
        double totalExpenses =
                invoices.stream()
                        .mapToDouble(Invoice::getTotalAmount)
                        .sum();

        // 3. Category-wise expenses
        Map<String, Double> categoryWiseExpenses =
                invoices.stream()
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                invoice.getCategory() != null
                                                        ? invoice.getCategory()
                                                        : "OTHER",
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                )
                        );

        // 4. Vendor-wise expenses
        Map<String, Double> vendorWiseExpenses =
                invoices.stream()
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                invoice.getVendor() != null
                                                        && invoice.getVendor().getName() != null
                                                        ? invoice.getVendor().getName()
                                                        : "UNKNOWN",
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                )
                        );

        // 5. Monthly expenses
        Map<String, Double> monthlyExpenses =
                invoices.stream()
                        .filter(invoice ->
                                invoice.getInvoiceDate() != null
                        )
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                YearMonth.from(
                                                        invoice.getInvoiceDate()
                                                ).toString(),
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                )
                        );

        // Sort monthly expenses chronologically
        Map<String, Double> sortedMonthlyExpenses =
                monthlyExpenses.entrySet()
                        .stream()
                        .sorted(
                                Map.Entry.comparingByKey()
                        )
                        .collect(
                                Collectors.toMap(
                                        Map.Entry::getKey,
                                        Map.Entry::getValue,
                                        (first, second) -> first,
                                        LinkedHashMap::new
                                )
                        );

        // 6. Recent invoices
        List<Invoice> recentInvoices =
                invoices.stream()
                        .sorted(
                                Comparator.comparing(
                                        Invoice::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(5)
                        .toList();

        // 7. Build dashboard response
        return new DashboardResponseDTO(
                totalInvoices,
                totalExpenses,
                categoryWiseExpenses,
                vendorWiseExpenses,
                sortedMonthlyExpenses,
                recentInvoices
        );
    }
}