package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.entity.DuplicateResult;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

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

        // Retrieve only this user's invoices.
        List<Invoice> userInvoices =
                invoiceRepository.findByUserId(userId);

        if (userInvoices == null || userInvoices.isEmpty()) {
            return noDuplicate();
        }

        // Primary check: normalized vendor + invoice number.
        if (vendorName != null && invoiceNumber != null) {

            for (Invoice existingInvoice : userInvoices) {

                if (existingInvoice == null
                        || isSameInvoice(invoice, existingInvoice)) {
                    continue;
                }

                String existingVendorName = normalize(
                        existingInvoice.getVendor() != null
                                ? existingInvoice.getVendor().getName()
                                : null
                );

                String existingInvoiceNumber = normalize(
                        existingInvoice.getInvoiceNumber()
                );

                if (vendorName.equals(existingVendorName)
                        && invoiceNumber.equals(existingInvoiceNumber)) {

                    return potentialDuplicate(
                            existingInvoice.getId()
                    );
                }
            }
        }

        // Secondary check: normalized vendor + exact date + exact total.
        // Preserve the existing date-and-total matching behavior.
        if (vendorName != null
                && invoice.getInvoiceDate() != null
                && Double.isFinite(invoice.getTotalAmount())
                && invoice.getTotalAmount() >= 0) {

            for (Invoice existingInvoice : userInvoices) {

                if (existingInvoice == null
                        || isSameInvoice(invoice, existingInvoice)) {
                    continue;
                }

                String existingVendorName = normalize(
                        existingInvoice.getVendor() != null
                                ? existingInvoice.getVendor().getName()
                                : null
                );

                if (vendorName.equals(existingVendorName)
                        && invoice.getInvoiceDate().equals(
                        existingInvoice.getInvoiceDate()
                )
                        && Double.isFinite(existingInvoice.getTotalAmount())
                        && Double.compare(
                        invoice.getTotalAmount(),
                        existingInvoice.getTotalAmount()
                ) == 0) {

                    return potentialDuplicate(
                            existingInvoice.getId()
                    );
                }
            }
        }

        return noDuplicate();
    }

    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim()
                .replaceAll("\\s+", " ")
                .toUpperCase(Locale.ROOT);
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

    private DuplicateResult potentialDuplicate(
            String matchedInvoiceId
    ) {

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
