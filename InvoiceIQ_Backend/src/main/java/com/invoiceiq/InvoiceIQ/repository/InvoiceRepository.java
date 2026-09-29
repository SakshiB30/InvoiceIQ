package com.invoiceiq.InvoiceIQ.repository;

import com.invoiceiq.InvoiceIQ.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository
        extends MongoRepository<Invoice, String> {

    List<Invoice> findByUserId(String userId);

    Optional<Invoice> findByIdAndUserId(
            String id,
            String userId
    );

    boolean existsByUserIdAndInvoiceNumber(
            String userId,
            String invoiceNumber
    );

    Optional<Invoice> findByUserIdAndVendor_NameAndInvoiceNumber(
            String userId,
            String vendorName,
            String invoiceNumber
    );

    List<Invoice> findByUserIdAndVendor_NameAndInvoiceDateAndTotalAmount(
            String userId,
            String vendorName,
            java.time.LocalDate invoiceDate,
            double totalAmount
    );
}