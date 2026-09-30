package com.invoiceiq.InvoiceIQ.controller;

import com.invoiceiq.InvoiceIQ.dto.DashboardResponseDTO;
import com.invoiceiq.InvoiceIQ.service.DashboardService;
import com.invoiceiq.InvoiceIQ.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard() {

        String userId =
                securityUtil.getCurrentUserId();

        DashboardResponseDTO dashboard =
                dashboardService.getDashboard(userId);

        return ResponseEntity.ok(dashboard);
    }
}