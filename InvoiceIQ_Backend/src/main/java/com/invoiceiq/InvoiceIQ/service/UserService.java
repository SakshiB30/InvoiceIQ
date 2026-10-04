package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.UpdateProfileRequest;
import com.invoiceiq.InvoiceIQ.entity.User;
import com.invoiceiq.InvoiceIQ.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateProfile(
            String userId,
            UpdateProfileRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setName(request.getName());
        user.setBusinessName(request.getBusinessName());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User getCurrentUser(String userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }
}