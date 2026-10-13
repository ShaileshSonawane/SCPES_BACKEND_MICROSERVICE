package com.scpes.identity.dto;

import com.scpes.identity.entity.User;

import java.time.Instant;
import java.util.UUID;

public record UserDto(
        UUID id,
        String userCode,
        String email,
        String role,
        String status,
        Instant createdAt
) {
    public static UserDto from(User u) {
        return new UserDto(
                u.getId(),
                u.getUserCode(),
                u.getEmail(),
                u.getRole().getName(),
                u.getStatus().name(),
                u.getCreatedAt()
        );
    }
}
