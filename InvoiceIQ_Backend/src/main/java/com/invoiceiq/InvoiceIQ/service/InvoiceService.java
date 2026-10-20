package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
import com.invoiceiq.InvoiceIQ.entity.DuplicateResult;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import com.invoiceiq.InvoiceIQ.entity.InvoiceItem;
import com.invoiceiq.InvoiceIQ.entity.ValidationResult;
import com.invoiceiq.InvoiceIQ.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceValidationService invoiceValidationService;

    public Invoice createInvoice(Invoice invoice, String userId) {
        invoice.setUserId(userId);

        LocalDateTime now = LocalDateTime.now();
        invoice.setCreatedAt(now);
        invoice.setUpdatedAt(now);

        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getUserInvoices(
            String userId,
            String search,
            String category,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        List<Invoice> invoices;

        if (search != null && !search.isBlank()) {
            invoices = searchInvoices(userId, search);
        } else {
            invoices = invoiceRepository.findByUserId(userId);
        }

        if (category != null && !category.isBlank()) {
            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getCategory() != null
                                    && invoice.getCategory()
                                    .equalsIgnoreCase(category)
                    )
                    .toList();
        }

        if (fromDate != null) {
            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getInvoiceDate() != null
                                    && !invoice.getInvoiceDate()
                                    .isBefore(fromDate)
                    )
                    .toList();
        }

        if (toDate != null) {
            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getInvoiceDate() != null
                                    && !invoice.getInvoiceDate()
                                    .isAfter(toDate)
                    )
                    .toList();
        }

        return invoices;
    }

    private List<Invoice> searchInvoices(
            String userId,
            String search
    ) {
        List<Invoice> invoiceNumberResults =
                invoiceRepository
                        .findByUserIdAndInvoiceNumberContainingIgnoreCase(
                                userId,
                                search
                        );

        List<Invoice> vendorResults =
                invoiceRepository
                        .findByUserIdAndVendor_NameContainingIgnoreCase(
                                userId,
                                search
                        );

        return Stream.concat(
                        invoiceNumberResults.stream(),
                        vendorResults.stream()
                )
                .distinct()
                .toList();
    }

    public Invoice getInvoiceById(String invoiceId, String userId) {
        return invoiceRepository.findByIdAndUserId(invoiceId, userId)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.NOT_FOUND,
                                "Invoice not found"
                        )
                );
    }

    public Invoice updateInvoice(
            String invoiceId,
            String userId,
            Invoice updatedInvoice
    ) {
        Invoice existingInvoice =
                invoiceRepository.findByIdAndUserId(invoiceId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Invoice not found")
                        );

        existingInvoice.setVendor(updatedInvoice.getVendor());
        existingInvoice.setInvoiceNumber(updatedInvoice.getInvoiceNumber());
        existingInvoice.setInvoiceDate(updatedInvoice.getInvoiceDate());
        existingInvoice.setDueDate(updatedInvoice.getDueDate());
        existingInvoice.setItems(updatedInvoice.getItems());
        existingInvoice.setSubtotal(updatedInvoice.getSubtotal());
        existingInvoice.setTax(updatedInvoice.getTax());
        existingInvoice.setTotalAmount(updatedInvoice.getTotalAmount());
        existingInvoice.setCategory(updatedInvoice.getCategory());

        // Editing invalidates the previous validation result.
        existingInvoice.setProcessingStatus("PENDING");
        existingInvoice.setValidation(null);
        existingInvoice.setUpdatedAt(LocalDateTime.now());

        return invoiceRepository.save(existingInvoice);
    }

    public Invoice revalidateInvoice(String invoiceId, String userId) {
        Invoice invoice =
                invoiceRepository.findByIdAndUserId(invoiceId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Invoice not found")
                        );

        List<ExtractedInvoiceItemDTO> extractedItems = new ArrayList<>();

        if (invoice.getItems() != null) {
            for (InvoiceItem item : invoice.getItems()) {
                ExtractedInvoiceItemDTO extractedItem =
                        new ExtractedInvoiceItemDTO();

                extractedItem.setDescription(item.getDescription());
                extractedItem.setQuantity(item.getQuantity());
                extractedItem.setUnitPrice(item.getUnitPrice());
                extractedItem.setAmount(item.getAmount());

                extractedItems.add(extractedItem);
            }
        }

        ExtractedInvoiceDTO extractedInvoice =
                new ExtractedInvoiceDTO();

        if (invoice.getVendor() != null) {
            extractedInvoice.setVendorName(invoice.getVendor().getName());
            extractedInvoice.setGstin(invoice.getVendor().getGstin());
        }

        extractedInvoice.setInvoiceNumber(invoice.getInvoiceNumber());
        extractedInvoice.setInvoiceDate(invoice.getInvoiceDate());
        extractedInvoice.setDueDate(invoice.getDueDate());
        extractedInvoice.setItems(extractedItems);
        extractedInvoice.setSubtotal(invoice.getSubtotal());
        extractedInvoice.setTax(invoice.getTax());
        extractedInvoice.setTotalAmount(invoice.getTotalAmount());

        ValidationResult validationResult =
                invoiceValidationService.validate(extractedInvoice);

        invoice.setValidation(validationResult);
        invoice.setUpdatedAt(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    public Invoice confirmInvoice(String invoiceId, String userId) {
        Invoice invoice =
                invoiceRepository.findByIdAndUserId(invoiceId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Invoice not found")
                        );

        ValidationResult validation = invoice.getValidation();

        if (validation == null || !validation.isValid()) {
            throw new IllegalStateException(
                    "Invoice cannot be confirmed until validation passes"
            );
        }

        if ("COMPLETED".equalsIgnoreCase(invoice.getProcessingStatus())) {
            throw new IllegalStateException("Invoice is already completed");
        }

        invoice.setProcessingStatus("COMPLETED");
        invoice.setUpdatedAt(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    public Invoice reviewDuplicate(
            String invoiceId,
            String userId,
            String decision
    ) {
        Invoice invoice =
                invoiceRepository.findByIdAndUserId(invoiceId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Invoice not found")
                        );

        if (!"COMPLETED".equalsIgnoreCase(invoice.getProcessingStatus())) {
            throw new IllegalStateException(
                    "Only completed invoices can have their duplicates reviewed"
            );
        }

        DuplicateResult duplicate = invoice.getDuplicate();

        if (duplicate == null || !duplicate.isPotentialDuplicate()) {
            throw new IllegalStateException(
                    "This invoice has no potential duplicate to review"
            );
        }

        if (decision == null
                || (!"CONFIRMED_SEPARATE".equals(decision)
                && !"CONFIRMED_DUPLICATE".equals(decision))) {
            throw new IllegalArgumentException(
                    "Decision must be CONFIRMED_SEPARATE or CONFIRMED_DUPLICATE"
            );
        }

        duplicate.setReviewDecision(decision);
        invoice.setDuplicate(duplicate);
        invoice.setUpdatedAt(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(String invoiceId, String userId) {
        Invoice invoice =
                invoiceRepository.findByIdAndUserId(invoiceId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Invoice not found")
                        );

        invoiceRepository.delete(invoice);
    }
}
