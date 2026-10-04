package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceItemDTO;
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

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final InvoiceValidationService invoiceValidationService;


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


    public List<Invoice> getUserInvoices(
            String userId,
            String search,
            String category,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        List<Invoice> invoices;

        if (search != null && !search.isBlank()) {

            invoices = searchInvoices(
                    userId,
                    search
            );

        } else {

            invoices =
                    invoiceRepository.findByUserId(
                            userId
                    );
        }

        if (category != null &&
                !category.isBlank()) {

            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getCategory() != null
                                    && invoice.getCategory()
                                    .equalsIgnoreCase(
                                            category
                                    )
                    )
                    .toList();
        }

        if (fromDate != null) {

            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getInvoiceDate() != null
                                    && !invoice
                                    .getInvoiceDate()
                                    .isBefore(fromDate)
                    )
                    .toList();
        }

        if (toDate != null) {

            invoices = invoices.stream()
                    .filter(invoice ->
                            invoice.getInvoiceDate() != null
                                    && !invoice
                                    .getInvoiceDate()
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

        return java.util.stream.Stream
                .concat(
                        invoiceNumberResults.stream(),
                        vendorResults.stream()
                )
                .distinct()
                .toList();
    }


    public Invoice getInvoiceById(
            String invoiceId,
            String userId
    ) {
        return invoiceRepository
                .findByIdAndUserId(
                        invoiceId,
                        userId
                )
                .orElseThrow(() ->
                        new RuntimeException(
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
                invoiceRepository
                        .findByIdAndUserId(
                                invoiceId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );


        existingInvoice.setVendor(
                updatedInvoice.getVendor()
        );


        existingInvoice.setInvoiceNumber(
                updatedInvoice.getInvoiceNumber()
        );


        existingInvoice.setInvoiceDate(
                updatedInvoice.getInvoiceDate()
        );


        existingInvoice.setDueDate(
                updatedInvoice.getDueDate()
        );


        existingInvoice.setItems(
                updatedInvoice.getItems()
        );


        existingInvoice.setSubtotal(
                updatedInvoice.getSubtotal()
        );


        existingInvoice.setTax(
                updatedInvoice.getTax()
        );


        existingInvoice.setTotalAmount(
                updatedInvoice.getTotalAmount()
        );


        existingInvoice.setCategory(
                updatedInvoice.getCategory()
        );


        /*
         * Editing an invoice invalidates
         * the previous validation result.
         */
        existingInvoice.setProcessingStatus(
                "PENDING"
        );

        existingInvoice.setValidation(
                null
        );


        existingInvoice.setUpdatedAt(
                LocalDateTime.now()
        );


        return invoiceRepository.save(
                existingInvoice
        );
    }


    /**
     * Re-validates the currently saved invoice.
     *
     * This converts the saved Invoice entity
     * back into ExtractedInvoiceDTO so that the
     * existing InvoiceValidationService can be
     * reused.
     */
    public Invoice revalidateInvoice(
            String invoiceId,
            String userId
    ) {
        Invoice invoice =
                invoiceRepository
                        .findByIdAndUserId(
                                invoiceId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );


        /*
         * Convert saved invoice items into
         * ExtractedInvoiceItemDTO objects.
         */
        List<ExtractedInvoiceItemDTO> extractedItems =
                new ArrayList<>();


        if (invoice.getItems() != null) {

            for (
                    InvoiceItem item :
                    invoice.getItems()
            ) {

                ExtractedInvoiceItemDTO extractedItem =
                        new ExtractedInvoiceItemDTO();


                extractedItem.setDescription(
                        item.getDescription()
                );


                extractedItem.setQuantity(
                        item.getQuantity()
                );


                extractedItem.setUnitPrice(
                        item.getUnitPrice()
                );


                extractedItem.setAmount(
                        item.getAmount()
                );


                extractedItems.add(
                        extractedItem
                );
            }
        }


        /*
         * Convert Invoice into
         * ExtractedInvoiceDTO.
         */
        ExtractedInvoiceDTO extractedInvoice =
                new ExtractedInvoiceDTO();


        if (invoice.getVendor() != null) {

            extractedInvoice.setVendorName(
                    invoice.getVendor().getName()
            );

            extractedInvoice.setGstin(
                    invoice.getVendor().getGstin()
            );
        }


        extractedInvoice.setInvoiceNumber(
                invoice.getInvoiceNumber()
        );


        extractedInvoice.setInvoiceDate(
                invoice.getInvoiceDate()
        );


        extractedInvoice.setDueDate(
                invoice.getDueDate()
        );


        extractedInvoice.setItems(
                extractedItems
        );


        extractedInvoice.setSubtotal(
                invoice.getSubtotal()
        );


        extractedInvoice.setTax(
                invoice.getTax()
        );


        extractedInvoice.setTotalAmount(
                invoice.getTotalAmount()
        );


        /*
         * Run the existing validation logic.
         */
        ValidationResult validationResult =
                invoiceValidationService.validate(
                        extractedInvoice
                );


        /*
         * Store the new validation result.
         */
        invoice.setValidation(
                validationResult
        );


        invoice.setUpdatedAt(
                LocalDateTime.now()
        );


        return invoiceRepository.save(
                invoice
        );
    }


    public Invoice confirmInvoice(
            String invoiceId,
            String userId
    ) {
        Invoice invoice =
                invoiceRepository
                        .findByIdAndUserId(
                                invoiceId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );


        invoice.setProcessingStatus(
                "COMPLETED"
        );


        invoice.setUpdatedAt(
                LocalDateTime.now()
        );


        return invoiceRepository.save(
                invoice
        );
    }


    public void deleteInvoice(
            String invoiceId,
            String userId
    ) {
        Invoice invoice =
                invoiceRepository
                        .findByIdAndUserId(
                                invoiceId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );


        invoiceRepository.delete(
                invoice
        );
    }
}
