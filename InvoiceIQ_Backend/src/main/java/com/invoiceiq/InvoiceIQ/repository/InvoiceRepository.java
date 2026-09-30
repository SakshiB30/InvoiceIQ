package com.invoiceiq.InvoiceIQ.repository;

import com.invoiceiq.InvoiceIQ.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository
        extends MongoRepository<Invoice, String> {

    // Get all invoices belonging to a user
    List<Invoice> findByUserId(String userId);

    // Get a specific invoice belonging to a user
    Optional<Invoice> findByIdAndUserId(
            String id,
            String userId
    );

    // Search by invoice number
    List<Invoice> findByUserIdAndInvoiceNumberContainingIgnoreCase(
            String userId,
            String invoiceNumber
    );

    // Search by vendor name
    List<Invoice> findByUserIdAndVendor_NameContainingIgnoreCase(
            String userId,
            String vendorName
    );

    // Filter by category
    List<Invoice> findByUserIdAndCategory(
            String userId,
            String category
    );

    // Search invoice number for duplicate detection
    boolean existsByUserIdAndInvoiceNumber(
            String userId,
            String invoiceNumber
    );

    // Primary duplicate detection
    Optional<Invoice> findByUserIdAndVendor_NameAndInvoiceNumber(
            String userId,
            String vendorName,
            String invoiceNumber
    );

    // Secondary duplicate detection
    List<Invoice> findByUserIdAndVendor_NameAndInvoiceDateAndTotalAmount(
            String userId,
            String vendorName,
            java.time.LocalDate invoiceDate,
            double totalAmount
    );

    List<Invoice> findByUserIdAndInvoiceDateGreaterThanEqual(
            String userId,
            java.time.LocalDate fromDate
    );

    List<Invoice> findByUserIdAndInvoiceDateLessThanEqual(
            String userId,
            java.time.LocalDate toDate
    );
}