package com.scpes.placement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CompanyRegisterRequest(
        @NotBlank String name,
        String sector,
        String website,
        String description,
        @NotBlank @Email String contactEmail
) {}
