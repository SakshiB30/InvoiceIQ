package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class InvoiceValidationService {

    private static final double TOLERANCE = 0.01;

    private static final Pattern GSTIN_PATTERN = Pattern.compile(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"
    );

    public ValidationResult validate(ExtractedInvoiceDTO invoice) {

        List<String> validationIssues = new ArrayList<>();

        if (invoice == null) {
            validationIssues.add("Invoice data is missing");

            return new ValidationResult(
                    false,
                    false,
                    0.0,
                    0.0,
                    validationIssues
            );
        }

        // 1. Required fields

        if (isBlank(invoice.getVendorName())) {
            validationIssues.add("Vendor name is missing");
        }

        if (isBlank(invoice.getInvoiceNumber())) {
            validationIssues.add("Invoice number is missing");
        }

        if (invoice.getInvoiceDate() == null) {
            validationIssues.add("Invoice date is missing");
        }

        if (invoice.getSubtotal() == null) {
            validationIssues.add("Subtotal is missing");
        }

        if (invoice.getTax() == null) {
            validationIssues.add("Tax amount is missing");
        }

        if (invoice.getTotalAmount() == null) {
            validationIssues.add("Total amount is missing");
        }

        // 2. Optional GSTIN format validation

        String gstin = invoice.getGstin();

        if (!isBlank(gstin)
                && !GSTIN_PATTERN.matcher(
                gstin.trim().toUpperCase()
        ).matches()) {

            validationIssues.add("GSTIN format is invalid");
        }

        // 3. Numeric values

        Double subtotalValue = invoice.getSubtotal();
        Double taxValue = invoice.getTax();
        Double totalValue = invoice.getTotalAmount();

        double subtotal = subtotalValue != null
                && Double.isFinite(subtotalValue)
                ? subtotalValue
                : 0.0;

        double tax = taxValue != null
                && Double.isFinite(taxValue)
                ? taxValue
                : 0.0;

        double extractedTotal = totalValue != null
                && Double.isFinite(totalValue)
                ? totalValue
                : 0.0;

        if (subtotalValue != null) {
            if (!Double.isFinite(subtotalValue)) {
                validationIssues.add(
                        "Subtotal must be a finite number"
                );
            } else if (subtotalValue < 0) {
                validationIssues.add(
                        "Subtotal cannot be negative"
                );
            }
        }

        if (taxValue != null) {
            if (!Double.isFinite(taxValue)) {
                validationIssues.add(
                        "Tax amount must be a finite number"
                );
            } else if (taxValue < 0) {
                validationIssues.add(
                        "Tax amount cannot be negative"
                );
            }
        }

        if (totalValue != null) {
            if (!Double.isFinite(totalValue)) {
                validationIssues.add(
                        "Total amount must be a finite number"
                );
            } else if (totalValue < 0) {
                validationIssues.add(
                        "Total amount cannot be negative"
                );
            }
        }

        // 4. Date validation

        if (invoice.getInvoiceDate() != null
                && invoice.getDueDate() != null
                && invoice.getDueDate().isBefore(
                invoice.getInvoiceDate()
        )) {

            validationIssues.add(
                    "Due date cannot be before invoice date"
            );
        }

        // 5. Total calculation

        double expectedTotal = subtotal + tax;

        boolean totalMismatch = false;

        if (!Double.isFinite(expectedTotal)) {

            validationIssues.add(
                    "Calculated total exceeds the supported numeric range"
            );

        } else if (subtotalValue != null
                && taxValue != null
                && totalValue != null
                && Double.isFinite(subtotalValue)
                && Double.isFinite(taxValue)
                && Double.isFinite(totalValue)) {

            totalMismatch = Math.abs(
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
        }

        // 6. Line-item validation

        List<ExtractedInvoiceItemDTO> items = invoice.getItems();

        if (items == null || items.isEmpty()) {

            validationIssues.add(
                    "Invoice contains no line items"
            );

        } else {

            double calculatedSubtotal = 0.0;
            boolean subtotalCalculationReliable = true;

            for (int i = 0; i < items.size(); i++) {

                ExtractedInvoiceItemDTO item = items.get(i);

                if (item == null) {
                    validationIssues.add(
                            "Invoice item " + (i + 1) + " is invalid"
                    );

                    subtotalCalculationReliable = false;
                    continue;
                }

                String itemName = isBlank(item.getDescription())
                        ? "Item " + (i + 1)
                        : item.getDescription().trim();

                if (isBlank(item.getDescription())) {
                    validationIssues.add(
                            "Description is missing for " + itemName
                    );
                }

                Double quantityValue = item.getQuantity();
                Double unitPriceValue = item.getUnitPrice();
                Double amountValue = item.getAmount();

                if (quantityValue == null) {
                    validationIssues.add(
                            "Quantity is missing for " + itemName
                    );
                }

                if (unitPriceValue == null) {
                    validationIssues.add(
                            "Unit price is missing for " + itemName
                    );
                }

                if (amountValue == null) {
                    validationIssues.add(
                            "Amount is missing for " + itemName
                    );
                }

                if (quantityValue == null
                        || unitPriceValue == null
                        || amountValue == null) {

                    subtotalCalculationReliable = false;
                    continue;
                }

                double quantity = quantityValue;
                double unitPrice = unitPriceValue;
                double amount = amountValue;

                if (!Double.isFinite(quantity)) {
                    validationIssues.add(
                            "Quantity must be a finite number for "
                                    + itemName
                    );

                    subtotalCalculationReliable = false;
                    continue;
                }

                if (!Double.isFinite(unitPrice)) {
                    validationIssues.add(
                            "Unit price must be a finite number for "
                                    + itemName
                    );

                    subtotalCalculationReliable = false;
                    continue;
                }

                if (!Double.isFinite(amount)) {
                    validationIssues.add(
                            "Item amount must be a finite number for "
                                    + itemName
                    );

                    subtotalCalculationReliable = false;
                    continue;
                }

                boolean itemValid = true;

                if (quantity <= 0) {
                    validationIssues.add(
                            "Quantity must be greater than 0 for "
                                    + itemName
                    );

                    itemValid = false;
                }

                if (unitPrice < 0) {
                    validationIssues.add(
                            "Unit price cannot be negative for "
                                    + itemName
                    );

                    itemValid = false;
                }

                if (amount < 0) {
                    validationIssues.add(
                            "Item amount cannot be negative for "
                                    + itemName
                    );

                    itemValid = false;
                }

                double expectedItemAmount = quantity * unitPrice;

                if (!Double.isFinite(expectedItemAmount)) {

                    validationIssues.add(
                            "Calculated amount exceeds the supported numeric range for "
                                    + itemName
                    );

                    subtotalCalculationReliable = false;
                    continue;
                }

                if (Math.abs(expectedItemAmount - amount) > TOLERANCE) {
                    validationIssues.add(
                            String.format(
                                    "Item amount mismatch for %s: expected %.2f but extracted %.2f",
                                    itemName,
                                    expectedItemAmount,
                                    amount
                            )
                    );

                    itemValid = false;
                }

                if (itemValid) {

                    calculatedSubtotal += amount;

                    if (!Double.isFinite(calculatedSubtotal)) {

                        validationIssues.add(
                                "Calculated line-item subtotal exceeds the supported numeric range"
                        );

                        subtotalCalculationReliable = false;
                        break;
                    }
                } else {
                    subtotalCalculationReliable = false;
                }
            }

            // Compare the sum of line items with the extracted subtotal.

            if (subtotalCalculationReliable
                    && subtotalValue != null
                    && Double.isFinite(subtotalValue)
                    && Math.abs(calculatedSubtotal - subtotal) > TOLERANCE) {

                validationIssues.add(
                        String.format(
                                "Subtotal mismatch: line items total %.2f but extracted subtotal is %.2f",
                                calculatedSubtotal,
                                subtotal
                        )
                );
            }
        }

        // 7. Overall result

        boolean valid = validationIssues.isEmpty();

        return new ValidationResult(
                valid,
                totalMismatch,
                Double.isFinite(expectedTotal) ? expectedTotal : 0.0,
                extractedTotal,
                validationIssues
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}