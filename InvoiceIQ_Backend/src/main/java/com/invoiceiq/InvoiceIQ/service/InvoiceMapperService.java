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

        Invoice invoice = new Invoice();

        // User
        invoice.setUserId(userId);

        // Vendor
        Vendor vendor = new Vendor();

        vendor.setName(dto.getVendorName());
        vendor.setGstin(dto.getGstin());

        invoice.setVendor(vendor);

        // Basic invoice information
        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setDueDate(dto.getDueDate());

        // Items
        if (dto.getItems() != null) {

            List<InvoiceItem> items =
                    dto.getItems()
                            .stream()
                            .map(this::mapItem)
                            .toList();

            invoice.setItems(items);
        }

        // Financial information
        invoice.setSubtotal(
                dto.getSubtotal() != null
                        ? dto.getSubtotal()
                        : 0.0
        );

        invoice.setTax(
                dto.getTax() != null
                        ? dto.getTax()
                        : 0.0
        );

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

        InvoiceItem item = new InvoiceItem();

        item.setDescription(dto.getDescription());

        item.setQuantity(
                dto.getQuantity() != null
                        ? dto.getQuantity()
                        : 0.0
        );

        item.setUnitPrice(
                dto.getUnitPrice() != null
                        ? dto.getUnitPrice()
                        : 0.0
        );

        item.setAmount(
                dto.getAmount() != null
                        ? dto.getAmount()
                        : 0.0
        );

        return item;
    }
}