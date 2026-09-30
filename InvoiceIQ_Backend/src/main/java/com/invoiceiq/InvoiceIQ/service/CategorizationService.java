package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.InvoiceItem;
import org.springframework.stereotype.Service;

@Service
public class CategorizationService {

    public String categorize(Invoice invoice) {

        if (invoice == null) {
            return "OTHER";
        }

        // Check invoice items
        if (invoice.getItems() != null) {

            for (InvoiceItem item : invoice.getItems()) {

                if (item.getDescription() == null) {
                    continue;
                }

                String description =
                        item.getDescription().toLowerCase();

                String category =
                        categorizeByKeywords(description);

                if (!category.equals("OTHER")) {
                    return category;
                }
            }
        }

        // Check vendor name
        if (invoice.getVendor() != null &&
                invoice.getVendor().getName() != null) {

            String vendorName =
                    invoice.getVendor()
                            .getName()
                            .toLowerCase();

            String category =
                    categorizeByKeywords(vendorName);

            if (!category.equals("OTHER")) {
                return category;
            }
        }

        return "OTHER";
    }

    private String categorizeByKeywords(String text) {

        // Inventory
        if (containsAny(
                text,
                "raw material",
                "material",
                "fabric",
                "cloth",
                "cotton",
                "textile",
                "product",
                "stock",
                "inventory"
        )) {
            return "INVENTORY";
        }

        // Packaging
        if (containsAny(
                text,
                "box",
                "boxes",
                "packaging",
                "carton",
                "bubble wrap",
                "tape",
                "label",
                "pouch"
        )) {
            return "PACKAGING";
        }

        // Logistics
        if (containsAny(
                text,
                "courier",
                "shipping",
                "delivery",
                "transport",
                "freight",
                "logistics"
        )) {
            return "LOGISTICS";
        }

        // Marketing
        if (containsAny(
                text,
                "advertising",
                "advertisement",
                "ads",
                "marketing",
                "promotion",
                "facebook ads",
                "google ads"
        )) {
            return "MARKETING";
        }

        // Office expenses
        if (containsAny(
                text,
                "office",
                "stationery",
                "printer",
                "paper",
                "pen",
                "chair",
                "desk",
                "computer",
                "laptop"
        )) {
            return "OFFICE_EXPENSE";
        }

        // Software / IT
        if (containsAny(
                text,
                "software",
                "subscription",
                "saas",
                "cloud",
                "aws",
                "azure",
                "hosting",
                "domain",
                "server"
        )) {
            return "SOFTWARE_IT";
        }

        // Utilities
        if (containsAny(
                text,
                "electricity",
                "electric",
                "water",
                "internet",
                "telephone",
                "utility",
                "mobile"
        )) {
            return "UTILITIES";
        }

        return "OTHER";
    }

    private boolean containsAny(
            String text,
            String... keywords
    ) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}