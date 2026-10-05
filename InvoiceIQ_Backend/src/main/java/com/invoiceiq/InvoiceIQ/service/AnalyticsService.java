package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.AnalyticsComparisonDTO;
import com.invoiceiq.InvoiceIQ.dto.AnalyticsKPIDTO;
import com.invoiceiq.InvoiceIQ.dto.AnalyticsResponseDTO;
import com.invoiceiq.InvoiceIQ.dto.CategorySpendingDTO;
import com.invoiceiq.InvoiceIQ.dto.MonthlySpendingDTO;
import com.invoiceiq.InvoiceIQ.dto.VendorSpendingDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final InvoiceRepository invoiceRepository;

    private static final DateTimeFormatter MONTH_FORMATTER =
            DateTimeFormatter.ofPattern("MMM yyyy");


    public AnalyticsResponseDTO getAnalytics(
            String userId,
            LocalDate fromDate,
            LocalDate toDate
    ) {

        /*
         * Fetch all invoices belonging only
         * to the currently authenticated user.
         */
        List<Invoice> allInvoices =
                invoiceRepository.findByUserId(userId);


        /*
         * Apply the selected date range
         * to the current analytics period.
         */
        List<Invoice> invoices =
                filterByDateRange(
                        allInvoices,
                        fromDate,
                        toDate
                );


        /*
         * Keep only invoices that have
         * a valid invoice date.
         */
        List<Invoice> validInvoices =
                invoices.stream()
                        .filter(invoice ->
                                invoice.getInvoiceDate() != null
                        )
                        .toList();


        /*
         * Calculate current period KPIs.
         */
        AnalyticsKPIDTO kpis =
                calculateKPIs(validInvoices);


        /*
         * Calculate comparison with the
         * previous equivalent period.
         */
        AnalyticsComparisonDTO comparison =
                calculateComparison(
                        allInvoices,
                        fromDate,
                        toDate
                );


        /*
         * Calculate monthly spending.
         */
        List<MonthlySpendingDTO> monthlySpending =
                calculateMonthlySpending(
                        validInvoices
                );


        /*
         * Calculate category spending.
         */
        List<CategorySpendingDTO> categorySpending =
                calculateCategorySpending(
                        validInvoices
                );


        /*
         * Calculate top vendors.
         */
        List<VendorSpendingDTO> topVendors =
                calculateTopVendors(
                        validInvoices
                );


        return new AnalyticsResponseDTO(
                kpis,
                comparison,
                monthlySpending,
                categorySpending,
                topVendors
        );
    }


    private List<Invoice> filterByDateRange(
            List<Invoice> invoices,
            LocalDate fromDate,
            LocalDate toDate
    ) {

        return invoices.stream()
                .filter(invoice ->
                        invoice.getInvoiceDate() != null
                )
                .filter(invoice -> {

                    LocalDate invoiceDate =
                            invoice.getInvoiceDate();

                    if (fromDate != null &&
                            invoiceDate.isBefore(fromDate)) {

                        return false;
                    }

                    if (toDate != null &&
                            invoiceDate.isAfter(toDate)) {

                        return false;
                    }

                    return true;
                })
                .toList();
    }


    private AnalyticsComparisonDTO calculateComparison(
            List<Invoice> allInvoices,
            LocalDate fromDate,
            LocalDate toDate
    ) {

        /*
         * All Time has no meaningful
         * previous period.
         */
        if (fromDate == null || toDate == null) {
            return null;
        }


        /*
         * Calculate the previous period.
         */
        LocalDate previousFromDate;
        LocalDate previousToDate;


        /*
         * Calculate the number of days
         * in the selected period.
         */
        long periodDays =
                java.time.temporal.ChronoUnit.DAYS.between(
                        fromDate,
                        toDate
                ) + 1;


        /*
         * Previous period ends immediately
         * before the current period.
         */
        previousToDate =
                fromDate.minusDays(1);

        previousFromDate =
                previousToDate.minusDays(
                        periodDays - 1
                );


        /*
         * Get invoices from the previous
         * equivalent period.
         */
        List<Invoice> previousInvoices =
                filterByDateRange(
                        allInvoices,
                        previousFromDate,
                        previousToDate
                );


        /*
         * Calculate previous spending.
         */
        double previousTotalSpending =
                previousInvoices.stream()
                        .mapToDouble(
                                Invoice::getTotalAmount
                        )
                        .sum();


        /*
         * Calculate previous transaction count.
         */
        long previousTransactionCount =
                previousInvoices.size();


        /*
         * Calculate previous active months.
         */
        long previousMonthCount =
                previousInvoices.stream()
                        .map(invoice ->
                                YearMonth.from(
                                        invoice.getInvoiceDate()
                                )
                        )
                        .distinct()
                        .count();


        /*
         * Calculate previous average
         * monthly spending.
         */
        double previousAverageMonthlySpending =
                previousMonthCount == 0
                        ? 0.0
                        : previousTotalSpending
                        / previousMonthCount;


        /*
         * Calculate current period values.
         */
        List<Invoice> currentInvoices =
                filterByDateRange(
                        allInvoices,
                        fromDate,
                        toDate
                );


        double currentTotalSpending =
                currentInvoices.stream()
                        .mapToDouble(
                                Invoice::getTotalAmount
                        )
                        .sum();


        long currentTransactionCount =
                currentInvoices.size();


        /*
         * Calculate current active months.
         */
        long currentMonthCount =
                currentInvoices.stream()
                        .map(invoice ->
                                YearMonth.from(
                                        invoice.getInvoiceDate()
                                )
                        )
                        .distinct()
                        .count();


        /*
         * Calculate current average
         * monthly spending.
         */
        double currentAverageMonthlySpending =
                currentMonthCount == 0
                        ? 0.0
                        : currentTotalSpending
                        / currentMonthCount;


        /*
         * Calculate spending percentage change.
         */
        Double spendingChangePercentage =
                calculatePercentageChange(
                        previousTotalSpending,
                        currentTotalSpending
                );


        /*
         * Calculate transaction percentage change.
         */
        Double transactionChangePercentage =
                calculatePercentageChange(
                        previousTransactionCount,
                        currentTransactionCount
                );


        /*
         * Calculate average monthly spending
         * percentage change.
         */
        Double averageMonthlySpendingChangePercentage =
                calculatePercentageChange(
                        previousAverageMonthlySpending,
                        currentAverageMonthlySpending
                );


        return new AnalyticsComparisonDTO(
                previousTotalSpending,
                spendingChangePercentage,
                previousTransactionCount,
                transactionChangePercentage,
                previousAverageMonthlySpending,
                averageMonthlySpendingChangePercentage
        );
    }


    private Double calculatePercentageChange(
            double previousValue,
            double currentValue
    ) {

        /*
         * When the previous period has
         * zero value, percentage change
         * is not mathematically meaningful.
         */
        if (previousValue == 0) {

            if (currentValue == 0) {
                return 0.0;
            }

            return null;
        }


        return (
                (currentValue - previousValue)
                        /
                        previousValue
        ) * 100.0;
    }


    private AnalyticsKPIDTO calculateKPIs(
            List<Invoice> invoices
    ) {

        /*
         * No invoice data.
         */
        if (invoices.isEmpty()) {

            return new AnalyticsKPIDTO(
                    0.0,
                    0.0,
                    "N/A",
                    "N/A",
                    0
            );
        }


        /*
         * Total spending.
         */
        double totalSpending =
                invoices.stream()
                        .mapToDouble(
                                Invoice::getTotalAmount
                        )
                        .sum();


        /*
         * Number of transactions.
         */
        long transactionCount =
                invoices.size();


        /*
         * Calculate the number of
         * distinct months represented
         * by the invoice data.
         */
        long monthCount =
                invoices.stream()
                        .map(invoice ->
                                YearMonth.from(
                                        invoice.getInvoiceDate()
                                )
                        )
                        .distinct()
                        .count();


        /*
         * Average monthly spending.
         */
        double averageMonthlySpending =
                monthCount == 0
                        ? 0.0
                        : totalSpending / monthCount;


        /*
         * Top spending category.
         */
        String topCategory =
                invoices.stream()
                        .filter(invoice ->
                                invoice.getCategory() != null
                                        &&
                                        !invoice.getCategory()
                                                .isBlank()
                        )
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                invoice.getCategory()
                                                        .trim(),
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                )
                        )
                        .entrySet()
                        .stream()
                        .max(
                                Map.Entry.comparingByValue()
                        )
                        .map(
                                Map.Entry::getKey
                        )
                        .orElse("N/A");


        /*
         * Top vendor.
         */
        String topVendor =
                invoices.stream()
                        .filter(invoice ->
                                invoice.getVendor() != null
                                        &&
                                        invoice.getVendor()
                                                .getName() != null
                                        &&
                                        !invoice.getVendor()
                                                .getName()
                                                .isBlank()
                        )
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                invoice.getVendor()
                                                        .getName()
                                                        .trim(),
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                )
                        )
                        .entrySet()
                        .stream()
                        .max(
                                Map.Entry.comparingByValue()
                        )
                        .map(
                                Map.Entry::getKey
                        )
                        .orElse("N/A");


        return new AnalyticsKPIDTO(
                totalSpending,
                averageMonthlySpending,
                topCategory,
                topVendor,
                transactionCount
        );
    }


    private List<MonthlySpendingDTO> calculateMonthlySpending(
            List<Invoice> invoices
    ) {

        Map<YearMonth, Double> monthlyTotals =
                invoices.stream()
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                YearMonth.from(
                                                        invoice.getInvoiceDate()
                                                ),
                                        LinkedHashMap::new,
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                )
                        );


        return monthlyTotals.entrySet()
                .stream()
                .sorted(
                        Map.Entry.comparingByKey()
                )
                .map(entry ->
                        new MonthlySpendingDTO(
                                entry.getKey()
                                        .format(
                                                MONTH_FORMATTER
                                        ),
                                entry.getValue()
                        )
                )
                .toList();
    }


    private List<CategorySpendingDTO> calculateCategorySpending(
            List<Invoice> invoices
    ) {

        Map<String, Double> categoryTotals =
                invoices.stream()
                        .filter(invoice ->
                                invoice.getCategory() != null
                                        &&
                                        !invoice.getCategory()
                                                .isBlank()
                        )
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                invoice.getCategory()
                                                        .trim(),
                                        Collectors.summingDouble(
                                                Invoice::getTotalAmount
                                        )
                                ));


        double totalCategorySpending =
                categoryTotals.values()
                        .stream()
                        .mapToDouble(Double::doubleValue)
                        .sum();


        return categoryTotals.entrySet()
                .stream()
                .sorted(
                        Map.Entry
                                .<String, Double>comparingByValue()
                                .reversed()
                )
                .map(entry -> {

                    double percentage =
                            totalCategorySpending == 0
                                    ? 0.0
                                    : (
                                    entry.getValue()
                                            /
                                            totalCategorySpending
                            ) * 100.0;


                    return new CategorySpendingDTO(
                            entry.getKey(),
                            entry.getValue(),
                            percentage
                    );
                })
                .toList();
    }


    private List<VendorSpendingDTO> calculateTopVendors(
            List<Invoice> invoices
    ) {

        Map<String, List<Invoice>> vendorInvoices =
                invoices.stream()
                        .filter(invoice ->
                                invoice.getVendor() != null
                                        &&
                                        invoice.getVendor()
                                                .getName() != null
                                        &&
                                        !invoice.getVendor()
                                                .getName()
                                                .isBlank()
                        )
                        .collect(
                                Collectors.groupingBy(
                                        invoice ->
                                                invoice.getVendor()
                                                        .getName()
                                                        .trim()
                                )
                        );


        return vendorInvoices.entrySet()
                .stream()
                .map(entry -> {

                    String vendorName =
                            entry.getKey();

                    List<Invoice> vendorInvoiceList =
                            entry.getValue();


                    double amount =
                            vendorInvoiceList.stream()
                                    .mapToDouble(
                                            Invoice::getTotalAmount
                                    )
                                    .sum();


                    long transactionCount =
                            vendorInvoiceList.size();


                    return new VendorSpendingDTO(
                            vendorName,
                            amount,
                            transactionCount
                    );
                })
                .sorted(
                        Comparator.comparingDouble(
                                VendorSpendingDTO::getAmount
                        ).reversed()
                )
                .limit(5)
                .toList();
    }
}
