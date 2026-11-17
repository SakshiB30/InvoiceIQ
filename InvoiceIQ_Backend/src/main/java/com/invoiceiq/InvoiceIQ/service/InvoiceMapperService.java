package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.InvoiceItem;
import com.invoiceiq.InvoiceIQ.entity.Vendor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceMapperService {

    public Invoice mapToInvoice(
            ExtractedInvoiceDTO dto,
            String userId
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Extracted document data cannot be null"
            );
        }

        Invoice invoice = new Invoice();

        // User
        invoice.setUserId(userId);

        // Document type
        invoice.setDocumentType(
                dto.getDocumentType() != null
                        && !dto.getDocumentType().isBlank()
                        ? dto.getDocumentType().trim().toUpperCase()
                        : "OTHER"
        );

        // Vendor
        Vendor vendor = new Vendor();

        vendor.setName(dto.getVendorName());
        vendor.setGstin(dto.getGstin());

        invoice.setVendor(vendor);

        // Basic document information
        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setDueDate(dto.getDueDate());

        // Items
        if (dto.getItems() != null) {

            List<InvoiceItem> items = dto.getItems()
                    .stream()
                    .map(this::mapItem)
                    .toList();

            invoice.setItems(items);
        }

        // Financial information
        // Preserve null when the AI could not extract a value.
        invoice.setSubtotal(dto.getSubtotal());
        invoice.setTax(dto.getTax());

        // Invoice.totalAmount is still a primitive double.
        // Validation separately identifies a missing total.
        invoice.setTotalAmount(
                dto.getTotalAmount() != null
                        ? dto.getTotalAmount()
                        : 0.0
        );

        return invoice;
    }

    private InvoiceItem mapItem(
            ExtractedInvoiceItemDTO dto
    ) {

        if (dto == null) {
            return null;
        }

        InvoiceItem item = new InvoiceItem();

        item.setDescription(dto.getDescription());

        // Preserve missing values.
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setAmount(dto.getAmount());

        return item;
    }
}