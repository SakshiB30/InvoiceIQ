package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public Invoice createInvoice(
            Invoice invoice,
            String userId
    ) {

        invoice.setUserId(userId);

        LocalDateTime now = LocalDateTime.now();

        invoice.setCreatedAt(now);
        invoice.setUpdatedAt(now);

        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getUserInvoices(
            String userId,
            String search,
            String category,
            LocalDate fromDate,
            LocalDate toDate
    ) {

        List<Invoice> invoices;

        // Step 1: Get invoices based on search
        if (search != null && !search.isBlank()) {

            invoices = searchInvoices(
                    userId,
                    search
            );

        } else {

            invoices =
                    invoiceRepository.findByUserId(userId);
        }

        // Step 2: Filter by category
        if (category != null && !category.isBlank()) {

            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getCategory() != null
                                    && invoice.getCategory()
                                    .equalsIgnoreCase(category)
                    )
                    .toList();
        }

        // Step 3: Filter by from date
        if (fromDate != null) {

            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getInvoiceDate() != null
                                    && !invoice.getInvoiceDate()
                                    .isBefore(fromDate)
                    )
                    .toList();
        }

        // Step 4: Filter by to date
        if (toDate != null) {

            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getInvoiceDate() != null
                                    && !invoice.getInvoiceDate()
                                    .isAfter(toDate)
                    )
                    .toList();
        }

        return invoices;
    }

    private List<Invoice> searchInvoices(
            String userId,
            String search
    ) {

        List<Invoice> invoiceNumberResults =
                invoiceRepository
                        .findByUserIdAndInvoiceNumberContainingIgnoreCase(
                                userId,
                                search
                        );

        List<Invoice> vendorResults =
                invoiceRepository
                        .findByUserIdAndVendor_NameContainingIgnoreCase(
                                userId,
                                search
                        );

        // Combine results without duplicates
        return java.util.stream.Stream
                .concat(
                        invoiceNumberResults.stream(),
                        vendorResults.stream()
                )
                .distinct()
                .toList();
    }

    public Invoice getInvoiceById(
            String invoiceId,
            String userId
    ) {

        return invoiceRepository
                .findByIdAndUserId(
                        invoiceId,
                        userId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invoice not found"
                        )
                );
    }

    public Invoice confirmInvoice(
            String invoiceId,
            String userId
    ) {

        Invoice invoice =
                invoiceRepository
                        .findByIdAndUserId(
                                invoiceId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );

        invoice.setProcessingStatus("COMPLETED");
        invoice.setUpdatedAt(
                LocalDateTime.now()
        );

        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(
            String invoiceId,
            String userId
    ) {

        Invoice invoice =
                invoiceRepository
                        .findByIdAndUserId(
                                invoiceId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );

        invoiceRepository.delete(invoice);
    }
}