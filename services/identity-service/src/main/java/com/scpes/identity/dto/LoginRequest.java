package com.scpes.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        String scpeId,
        String email,
        @NotBlank String password
) {}
