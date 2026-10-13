package com.scpes.identity.dto;

import java.util.UUID;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        long expiresInSec,
        String role,
        UUID userId,
        String email,
        String userCode
) {}
