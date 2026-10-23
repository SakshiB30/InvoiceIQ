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

        if (invoice == null
                || userId == null
                || userId.isBlank()) {

            return noDuplicate();
        }

        String vendorName = normalize(
                invoice.getVendor() != null
                        ? invoice.getVendor().getName()
                        : null
        );

        String invoiceNumber = normalize(
                invoice.getInvoiceNumber()
        );

        // Primary check: user + vendor + invoice number.
        if (vendorName != null && invoiceNumber != null) {

            Optional<Invoice> existingInvoice =
                    invoiceRepository
                            .findByUserIdAndVendor_NameAndInvoiceNumber(
                                    userId,
                                    vendorName,
                                    invoiceNumber
                            );

            if (existingInvoice.isPresent()
                    && !isSameInvoice(invoice, existingInvoice.get())) {

                return potentialDuplicate(
                        existingInvoice.get().getId()
                );
            }
        }

        // Secondary check requires a valid date and total.
        if (vendorName != null
                && invoice.getInvoiceDate() != null
                && Double.isFinite(invoice.getTotalAmount())
                && invoice.getTotalAmount() >= 0) {

            List<Invoice> possibleDuplicates =
                    invoiceRepository
                            .findByUserIdAndVendor_NameAndInvoiceDateAndTotalAmount(
                                    userId,
                                    vendorName,
                                    invoice.getInvoiceDate(),
                                    invoice.getTotalAmount()
                            );

            if (possibleDuplicates != null) {

                for (Invoice existingInvoice : possibleDuplicates) {

                    if (existingInvoice != null
                            && !isSameInvoice(invoice, existingInvoice)) {

                        return potentialDuplicate(
                                existingInvoice.getId()
                        );
                    }
                }
            }
        }

        return noDuplicate();
    }

    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim().replaceAll("\\s+", " ")
                .toUpperCase(java.util.Locale.ROOT);
    }

    private boolean isSameInvoice(
            Invoice invoice,
            Invoice existingInvoice
    ) {

        String currentId = invoice.getId();
        String existingId = existingInvoice.getId();

        return currentId != null
                && !currentId.isBlank()
                && currentId.equals(existingId);
    }

    private DuplicateResult potentialDuplicate(String matchedInvoiceId) {

        return new DuplicateResult(
                true,
                matchedInvoiceId,
                null
        );
    }

    private DuplicateResult noDuplicate() {

        return new DuplicateResult(
                false,
                null,
                null
        );
    }
}