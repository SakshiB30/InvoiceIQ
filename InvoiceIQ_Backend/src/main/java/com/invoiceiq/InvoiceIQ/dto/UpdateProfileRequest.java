package com.invoiceiq.InvoiceIQ.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Business name is required")
    private String businessName;
}





























































