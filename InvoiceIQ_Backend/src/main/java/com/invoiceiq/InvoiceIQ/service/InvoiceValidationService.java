package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceValidationService {

    private static final double TOLERANCE = 0.01;

    public ValidationResult validate(ExtractedInvoiceDTO invoice) {

        List<String> validationIssues = new ArrayList<>();

        /*
         * Safety check
         */
        if (invoice == null) {

            validationIssues.add(
                    "Invoice data is missing"
            );

            return new ValidationResult(
                    false,
                    false,
                    0.0,
                    0.0,
                    validationIssues
            );
        }

        /*
         * =====================================================
         * 1. REQUIRED FIELD VALIDATION
         * =====================================================
         */

        if (invoice.getVendorName() == null ||
                invoice.getVendorName().isBlank()) {

            validationIssues.add(
                    "Vendor name is missing"
            );
        }

        if (invoice.getInvoiceNumber() == null ||
                invoice.getInvoiceNumber().isBlank()) {

            validationIssues.add(
                    "Invoice number is missing"
            );
        }

        if (invoice.getInvoiceDate() == null) {

            validationIssues.add(
                    "Invoice date is missing"
            );
        }

        if (invoice.getTotalAmount() == null) {

            validationIssues.add(
                    "Total amount is missing"
            );
        }


        /*
         * =====================================================
         * 2. EXTRACT NUMERIC VALUES
         * =====================================================
         */

        double subtotal = invoice.getSubtotal() != null
                ? invoice.getSubtotal()
                : 0.0;

        double tax = invoice.getTax() != null
                ? invoice.getTax()
                : 0.0;

        double extractedTotal = invoice.getTotalAmount() != null
                ? invoice.getTotalAmount()
                : 0.0;


        /*
         * =====================================================
         * 3. NEGATIVE AMOUNT VALIDATION
         * =====================================================
         */

        if (subtotal < 0) {

            validationIssues.add(
                    "Subtotal cannot be negative"
            );
        }

        if (tax < 0) {

            validationIssues.add(
                    "Tax cannot be negative"
            );
        }

        if (extractedTotal < 0) {

            validationIssues.add(
                    "Total amount cannot be negative"
            );
        }


        /*
         * =====================================================
         * 4. DATE VALIDATION
         * =====================================================
         */

        if (invoice.getInvoiceDate() != null &&
                invoice.getDueDate() != null) {

            if (invoice.getDueDate()
                    .isBefore(invoice.getInvoiceDate())) {

                validationIssues.add(
                        "Due date cannot be before invoice date"
                );
            }
        }


        /*
         * =====================================================
         * 5. TOTAL CALCULATION
         * =====================================================
         */

        double expectedTotal =
                subtotal + tax;

        boolean totalMismatch =
                Math.abs(
                        expectedTotal - extractedTotal
                ) > TOLERANCE;

        if (totalMismatch) {

            validationIssues.add(
                    String.format(
                            "Total mismatch: expected %.2f but extracted %.2f",
                            expectedTotal,
                            extractedTotal
                    )
            );
        }


        /*
         * =====================================================
         * 6. ITEM VALIDATION
         * =====================================================
         */

        if (invoice.getItems() != null) {

            for (int i = 0;
                 i < invoice.getItems().size();
                 i++) {

                ExtractedInvoiceItemDTO item =
                        invoice.getItems().get(i);

                if (item == null) {

                    validationIssues.add(
                            "Invoice item " + (i + 1)
                                    + " is invalid"
                    );

                    continue;
                }

                String itemName =
                        item.getDescription() != null &&
                                !item.getDescription().isBlank()
                                ? item.getDescription()
                                : "Item " + (i + 1);


                /*
                 * -------------------------------------------------
                 * Item required fields
                 * -------------------------------------------------
                 */

                if (item.getQuantity() == null) {

                    validationIssues.add(
                            "Quantity is missing for "
                                    + itemName
                    );
                }

                if (item.getUnitPrice() == null) {

                    validationIssues.add(
                            "Unit price is missing for "
                                    + itemName
                    );
                }

                if (item.getAmount() == null) {

                    validationIssues.add(
                            "Amount is missing for "
                                    + itemName
                    );
                }


                /*
                 * -------------------------------------------------
                 * Skip calculation if values are missing
                 * -------------------------------------------------
                 */

                if (item.getQuantity() == null ||
                        item.getUnitPrice() == null ||
                        item.getAmount() == null) {

                    continue;
                }


                double quantity =
                        item.getQuantity();

                double unitPrice =
                        item.getUnitPrice();

                double itemAmount =
                        item.getAmount();


                /*
                 * -------------------------------------------------
                 * Quantity validation
                 * -------------------------------------------------
                 */

                if (quantity <= 0) {

                    validationIssues.add(
                            "Quantity must be greater than 0 for "
                                    + itemName
                    );
                }


                /*
                 * -------------------------------------------------
                 * Unit price validation
                 * -------------------------------------------------
                 */

                if (unitPrice < 0) {

                    validationIssues.add(
                            "Unit price cannot be negative for "
                                    + itemName
                    );
                }


                /*
                 * -------------------------------------------------
                 * Item amount validation
                 * -------------------------------------------------
                 */

                if (itemAmount < 0) {

                    validationIssues.add(
                            "Item amount cannot be negative for "
                                    + itemName
                    );
                }


                /*
                 * -------------------------------------------------
                 * Item calculation
                 * -------------------------------------------------
                 */

                double expectedItemAmount =
                        quantity * unitPrice;

                boolean itemMismatch =
                        Math.abs(
                                expectedItemAmount - itemAmount
                        ) > TOLERANCE;

                if (itemMismatch) {

                    validationIssues.add(
                            String.format(
                                    "Item amount mismatch for %s: expected %.2f but extracted %.2f",
                                    itemName,
                                    expectedItemAmount,
                                    itemAmount
                            )
                    );
                }
            }
        }


        /*
         * =====================================================
         * 7. OVERALL VALIDATION
         * =====================================================
         */

        boolean valid =
                validationIssues.isEmpty();


        /*
         * =====================================================
         * 8. RETURN VALIDATION RESULT
         * =====================================================
         */

        return new ValidationResult(
                valid,
                totalMismatch,
                expectedTotal,
                extractedTotal,
                validationIssues
        );
    }
}
