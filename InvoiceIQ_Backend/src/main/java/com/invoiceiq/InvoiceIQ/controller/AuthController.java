package com.invoiceiq.InvoiceIQ.controller;

import com.invoiceiq.InvoiceIQ.dto.LoginRequest;
import com.invoiceiq.InvoiceIQ.dto.RegisterRequest;
import com.invoiceiq.InvoiceIQ.dto.UpdateProfileRequest;
import com.invoiceiq.InvoiceIQ.dto.UserProfileResponse;
import com.invoiceiq.InvoiceIQ.entity.User;
import com.invoiceiq.InvoiceIQ.service.AuthService;
import com.invoiceiq.InvoiceIQ.service.UserService;
import com.invoiceiq.InvoiceIQ.util.SecurityUtil;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final SecurityUtil securityUtil;

    public AuthController(
            AuthService authService,
            UserService userService,
            SecurityUtil securityUtil
    ) {
        this.authService = authService;
        this.userService = userService;
        this.securityUtil = securityUtil;
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

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        String userId = securityUtil.getCurrentUserId();

        User updatedUser =
                userService.updateProfile(userId, request);

        UserProfileResponse response = new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getBusinessName()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("JWT authentication successful");
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser() {

        String userId = securityUtil.getCurrentUserId();

        User user = userService.getCurrentUser(userId);

        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBusinessName()
        );

        return ResponseEntity.ok(response);
    }
}