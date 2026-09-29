package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public Invoice createInvoice(
            Invoice invoice,
            String userId
    ) {

        invoice.setUserId(userId);

        LocalDateTime now = LocalDateTime.now();

        invoice.setCreatedAt(now);
        invoice.setUpdatedAt(now);

        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getUserInvoices(String userId) {

        return invoiceRepository.findByUserId(userId);
    }

    public Invoice getInvoiceById(
            String invoiceId,
            String userId
    ) {

        return invoiceRepository
                .findByIdAndUserId(invoiceId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found")
                );
    }

    public void deleteInvoice(
            String invoiceId,
            String userId
    ) {

        Invoice invoice = invoiceRepository
                .findByIdAndUserId(invoiceId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found")
                );

        invoiceRepository.delete(invoice);
    }
}