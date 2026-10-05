package com.invoiceiq.InvoiceIQ.controller;

import com.invoiceiq.InvoiceIQ.dto.AnalyticsResponseDTO;
import com.invoiceiq.InvoiceIQ.service.AnalyticsService;
import com.invoiceiq.InvoiceIQ.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    private final SecurityUtil securityUtil;


    @GetMapping
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics(

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate

    ) {

        /*
         * Get the currently authenticated
         * user's ID from the JWT security context.
         */
        String userId =
                securityUtil.getCurrentUserId();


        /*
         * Generate analytics using only
         * this user's invoice data.
         */
        AnalyticsResponseDTO analytics =
                analyticsService.getAnalytics(
                        userId,
                        fromDate,
                        toDate
                );


        return ResponseEntity.ok(
                analytics
        );
    }
}