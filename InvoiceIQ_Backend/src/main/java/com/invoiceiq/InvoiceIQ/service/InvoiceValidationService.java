package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class InvoiceValidationService {

    private static final double TOLERANCE = 0.01;

    private static final Pattern GSTIN_PATTERN = Pattern.compile(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"
    );

    public ValidationResult validate(ExtractedInvoiceDTO invoice) {

        List<String> validationIssues = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (invoice == null) {
            validationIssues.add("Financial document data is missing");

            return createResult(
                    false, false, 0.0, 0.0,
                    false, validationIssues, warnings
            );
        }

        String documentType = invoice.getDocumentType() == null
                ? "OTHER"
                : invoice.getDocumentType().trim().toUpperCase(Locale.ROOT);

        // 1. Document identification

        if (isBlank(invoice.getVendorName())) {
            validationIssues.add("Vendor name is missing");
        }

        if (isBlank(invoice.getInvoiceNumber())) {
            warnings.add("Document or receipt number is missing");
        }

        if (invoice.getInvoiceDate() == null) {
            warnings.add("Document date is missing");
        }

        // 2. GSTIN validation

        String gstin = invoice.getGstin();

        if (!isBlank(gstin)
                && !GSTIN_PATTERN.matcher(
                gstin.trim().toUpperCase(Locale.ROOT)
        ).matches()) {

            validationIssues.add("GSTIN format is invalid");
        }

        // 3. Read financial values

        Double subtotalValue = invoice.getSubtotal();
        Double taxValue = invoice.getTax();
        Double totalValue = invoice.getTotalAmount();

        double subtotal = getSafeValue(subtotalValue);
        double tax = getSafeValue(taxValue);
        double extractedTotal = getSafeValue(totalValue);

        validateFinancialValue(
                subtotalValue, "Subtotal", validationIssues
        );

        validateFinancialValue(
                taxValue, "Tax amount", validationIssues
        );

        validateFinancialValue(
                totalValue, "Total amount", validationIssues
        );

        if (totalValue == null) {
            validationIssues.add("Total amount is missing");
        }

        // 4. Date validation

        if (invoice.getInvoiceDate() != null
                && invoice.getDueDate() != null
                && invoice.getDueDate().isBefore(invoice.getInvoiceDate())) {

            validationIssues.add(
                    "Due date cannot be before document date"
            );
        }

        // 5. Adaptive subtotal and tax validation

        if (subtotalValue == null) {
            warnings.add(
                    "Subtotal is not separately available in this document"
            );
        }

        if (taxValue == null) {
            warnings.add(
                    "Tax amount is not separately available in this document"
            );
        }

        // 6. Line-item validation

        List<ExtractedInvoiceItemDTO> items = invoice.getItems();

        double calculatedItemTotal = 0.0;
        boolean itemTotalReliable = items != null && !items.isEmpty();

        if (items == null || items.isEmpty()) {

            warnings.add(
                    "No individual line items were extracted"
            );

            itemTotalReliable = false;

        } else {

            for (int i = 0; i < items.size(); i++) {

                ExtractedInvoiceItemDTO item = items.get(i);

                if (item == null) {
                    warnings.add(
                            "Line item " + (i + 1) + " could not be interpreted"
                    );

                    itemTotalReliable = false;
                    continue;
                }

                String itemName = isBlank(item.getDescription())
                        ? "Item " + (i + 1)
                        : item.getDescription().trim();

                if (isBlank(item.getDescription())) {
                    warnings.add(
                            "Description is missing for " + itemName
                    );

                    itemTotalReliable = false;
                }

                Double quantityValue = item.getQuantity();
                Double unitPriceValue = item.getUnitPrice();
                Double amountValue = item.getAmount();

                // Quantity and unit price are optional.
                // Many receipts contain only a description and amount.

                if (quantityValue == null) {
                    warnings.add(
                            "Quantity is not available for " + itemName
                    );
                }

                if (unitPriceValue == null) {
                    warnings.add(
                            "Unit price is not available for " + itemName
                    );
                }

                if (amountValue == null) {
                    warnings.add(
                            "Amount is not available for " + itemName
                    );

                    itemTotalReliable = false;
                    continue;
                }

                if (!Double.isFinite(amountValue)) {
                    validationIssues.add(
                            "Item amount must be a finite number for " + itemName
                    );

                    itemTotalReliable = false;
                    continue;
                }

                if (amountValue < 0) {
                    validationIssues.add(
                            "Item amount cannot be negative for " + itemName
                    );

                    itemTotalReliable = false;
                    continue;
                }

                // Validate quantity when provided.

                if (quantityValue != null) {

                    if (!Double.isFinite(quantityValue)
                            || quantityValue <= 0) {

                        validationIssues.add(
                                "Quantity must be a finite positive number for "
                                        + itemName
                        );

                        itemTotalReliable = false;
                    }
                }

                // Validate unit price when provided.

                if (unitPriceValue != null) {

                    if (!Double.isFinite(unitPriceValue)
                            || unitPriceValue < 0) {

                        validationIssues.add(
                                "Unit price must be a finite non-negative number for "
                                        + itemName
                        );

                        itemTotalReliable = false;
                    }
                }

                // Check quantity × unit price only when both exist.

                if (quantityValue != null && unitPriceValue != null
                        && Double.isFinite(quantityValue)
                        && Double.isFinite(unitPriceValue)
                        && quantityValue > 0
                        && unitPriceValue >= 0) {

                    double expectedItemAmount =
                            quantityValue * unitPriceValue;

                    if (!Double.isFinite(expectedItemAmount)) {

                        validationIssues.add(
                                "Calculated amount exceeds the supported numeric range for "
                                        + itemName
                        );

                        itemTotalReliable = false;

                    } else if (Math.abs(
                            expectedItemAmount - amountValue
                    ) > TOLERANCE) {

                        validationIssues.add(
                                String.format(
                                        "Item amount mismatch for %s: expected %.2f but extracted %.2f",
                                        itemName,
                                        expectedItemAmount,
                                        amountValue
                                )
                        );

                        itemTotalReliable = false;
                    }
                }

                calculatedItemTotal += amountValue;

                if (!Double.isFinite(calculatedItemTotal)) {

                    validationIssues.add(
                            "Calculated line-item total exceeds the supported numeric range"
                    );

                    itemTotalReliable = false;
                    break;
                }
            }
        }

        // 7. Validate line-item subtotal when subtotal exists.

        if (subtotalValue != null
                && Double.isFinite(subtotalValue)
                && itemTotalReliable
                && Math.abs(calculatedItemTotal - subtotal) > TOLERANCE) {

            validationIssues.add(
                    String.format(
                            "Subtotal mismatch: line items total %.2f but extracted subtotal is %.2f",
                            calculatedItemTotal,
                            subtotal
                    )
            );
        }

        // 8. Calculate expected total where possible.

        double expectedTotal = 0.0;
        boolean totalVerificationPossible = false;
        boolean totalMismatch = false;

        if (subtotalValue != null
                && taxValue != null
                && Double.isFinite(subtotalValue)
                && Double.isFinite(taxValue)
                && subtotalValue >= 0
                && taxValue >= 0) {

            expectedTotal = subtotal + tax;

            if (!Double.isFinite(expectedTotal)) {

                validationIssues.add(
                        "Calculated total exceeds the supported numeric range"
                );

            } else if (totalValue != null
                    && Double.isFinite(totalValue)
                    && totalValue >= 0) {

                totalVerificationPossible = true;

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

        } else if (isReceiptType(documentType)
                && itemTotalReliable
                && totalValue != null
                && Double.isFinite(totalValue)
                && totalValue >= 0) {

            // For receipts without subtotal/tax,
            // compare actual line-item amounts with the paid total.

            expectedTotal = calculatedItemTotal;
            totalVerificationPossible = true;

            totalMismatch = Math.abs(
                    expectedTotal - extractedTotal
            ) > TOLERANCE;

            if (totalMismatch) {
                validationIssues.add(
                        String.format(
                                "Receipt total mismatch: line items total %.2f but extracted total is %.2f",
                                expectedTotal,
                                extractedTotal
                        )
                );
            }

        } else {

            warnings.add(
                    "Total could not be independently verified using the available financial details"
            );
        }

        // 9. Overall result

        boolean valid = validationIssues.isEmpty();

        return createResult(
                valid,
                totalMismatch,
                expectedTotal,
                extractedTotal,
                totalVerificationPossible,
                validationIssues,
                warnings
        );
    }

    private boolean isReceiptType(String documentType) {

        return switch (documentType) {
            case "FEE_RECEIPT",
                 "RETAIL_RECEIPT",
                 "RESTAURANT_RECEIPT",
                 "PAYMENT_RECEIPT" -> true;

            default -> false;
        };
    }

    private void validateFinancialValue(
            Double value,
            String fieldName,
            List<String> issues
    ) {

        if (value == null) {
            return;
        }

        if (!Double.isFinite(value)) {
            issues.add(fieldName + " must be a finite number");

        } else if (value < 0) {
            issues.add(fieldName + " cannot be negative");
        }
    }

    private double getSafeValue(Double value) {

        return value != null && Double.isFinite(value)
                ? value
                : 0.0;
    }

    private ValidationResult createResult(
            boolean valid,
            boolean totalMismatch,
            double expectedTotal,
            double extractedTotal,
            boolean totalVerificationPossible,
            List<String> missingFields,
            List<String> warnings
    ) {

        return new ValidationResult(
                valid,
                totalMismatch,
                expectedTotal,
                extractedTotal,
                missingFields,
                warnings,
                totalVerificationPossible
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}