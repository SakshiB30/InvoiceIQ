package com.invoiceiq.InvoiceIQ.controller;


import com.invoiceiq.InvoiceIQ.dto.RegisterRequest;
import com.invoiceiq.InvoiceIQ.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.invoiceiq.InvoiceIQ.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        authService.register(request);

        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @Valid @RequestBody LoginRequest request
    ) {

        String token = authService.login(request);

        return ResponseEntity.ok(token);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("JWT authentication successful");
    }
}
