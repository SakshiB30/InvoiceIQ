package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceValidationService {

    public ValidationResult validate(ExtractedInvoiceDTO invoice) {

        List<String> missingFields = new ArrayList<>();

        // 1. Check required fields

        if (invoice.getVendorName() == null ||
                invoice.getVendorName().isBlank()) {

            missingFields.add("Vendor name");
        }

        if (invoice.getInvoiceNumber() == null ||
                invoice.getInvoiceNumber().isBlank()) {

            missingFields.add("Invoice number");
        }

        if (invoice.getInvoiceDate() == null) {
            missingFields.add("Invoice date");
        }

        if (invoice.getTotalAmount() == null) {
            missingFields.add("Total amount");
        }


        // 2. Calculate expected total

        double subtotal = invoice.getSubtotal() != null
                ? invoice.getSubtotal()
                : 0.0;

        double tax = invoice.getTax() != null
                ? invoice.getTax()
                : 0.0;

        double extractedTotal = invoice.getTotalAmount() != null
                ? invoice.getTotalAmount()
                : 0.0;

        double expectedTotal = subtotal + tax;


        // 3. Check total calculation

        boolean totalMismatch =
                Math.abs(expectedTotal - extractedTotal) > 0.01;


        // 4. Check invoice items

        if (invoice.getItems() != null) {

            for (ExtractedInvoiceItemDTO item : invoice.getItems()) {

                if (item.getQuantity() == null ||
                        item.getUnitPrice() == null ||
                        item.getAmount() == null) {

                    continue;
                }

                double expectedItemAmount =
                        item.getQuantity() * item.getUnitPrice();

                boolean itemMismatch =
                        Math.abs(
                                expectedItemAmount - item.getAmount()
                        ) > 0.01;

                if (itemMismatch) {

                    missingFields.add(
                            "Item amount mismatch: "
                                    + item.getDescription()
                    );
                }
            }
        }


        // 5. Determine overall validity

        boolean valid =
                missingFields.isEmpty()
                        && !totalMismatch;


        // 6. Return validation result

        return new ValidationResult(
                valid,
                totalMismatch,
                expectedTotal,
                extractedTotal,
                missingFields
        );
    }
}