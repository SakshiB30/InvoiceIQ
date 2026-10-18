package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.entity.DuplicateResult;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DuplicateDetectionService {

    private final InvoiceRepository invoiceRepository;

    public DuplicateResult checkDuplicate(
            Invoice invoice,
            String userId
    ) {

        // Primary check: user + vendor + invoice number
        if (invoice.getInvoiceNumber() != null
                && !invoice.getInvoiceNumber().isBlank()
                && invoice.getVendor() != null
                && invoice.getVendor().getName() != null) {

            Optional<Invoice> existingInvoice =
                    invoiceRepository
                            .findByUserIdAndVendor_NameAndInvoiceNumber(
                                    userId,
                                    invoice.getVendor().getName(),
                                    invoice.getInvoiceNumber()
                            );

            if (existingInvoice.isPresent()) {
                return new DuplicateResult(
                        true,
                        existingInvoice.get().getId(),
                        null
                );
            }
        }

        // Secondary check: user + vendor + date + total
        if (invoice.getVendor() != null
                && invoice.getVendor().getName() != null
                && invoice.getInvoiceDate() != null) {

            List<Invoice> possibleDuplicates =
                    invoiceRepository
                            .findByUserIdAndVendor_NameAndInvoiceDateAndTotalAmount(
                                    userId,
                                    invoice.getVendor().getName(),
                                    invoice.getInvoiceDate(),
                                    invoice.getTotalAmount()
                            );

            if (!possibleDuplicates.isEmpty()) {
                return new DuplicateResult(
                        true,
                        possibleDuplicates.get(0).getId(),
                        null
                );
            }
        }

        // No potential duplicate found
        return new DuplicateResult(
                false,
                null,
                null
        );
    }
}