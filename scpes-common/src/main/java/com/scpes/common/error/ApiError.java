package com.scpes.common.error;

import org.springframework.http.HttpStatus;

import java.time.Instant;

public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path
) {
    public static ApiError of(HttpStatus s, String msg, String path) {
        return new ApiError(Instant.now(), s.value(), s.getReasonPhrase(), msg, path);
    }
}
