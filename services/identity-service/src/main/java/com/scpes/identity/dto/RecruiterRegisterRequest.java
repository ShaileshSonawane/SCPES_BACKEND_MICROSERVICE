package com.scpes.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RecruiterRegisterRequest(
        @NotBlank(message = "Company name is required")
        String companyName,

        @NotBlank(message = "Recruiter name is required")
        String recruiterName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password,

        String phone,
        String sector,
        String website
) {}
