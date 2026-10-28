package com.scpes.identity.dto;

public record AuthMessageResponse(
        boolean success,
        String message,
        String email,
        String scpeId,
        String simulatedOtp
) {}
