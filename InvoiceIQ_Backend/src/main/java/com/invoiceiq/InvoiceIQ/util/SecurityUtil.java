package com.invoiceiq.InvoiceIQ.util;

import com.invoiceiq.InvoiceIQ.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof User)) {

            throw new RuntimeException("User is not authenticated");
        }

        return (User) authentication.getPrincipal();
    }

    public String getCurrentUserId() {

        return getCurrentUser().getId();
    }
}