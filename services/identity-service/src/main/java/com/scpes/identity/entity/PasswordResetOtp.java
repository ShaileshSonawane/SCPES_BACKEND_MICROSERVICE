package com.scpes.identity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "password_reset_otps")
@Getter
@Setter
@NoArgsConstructor
public class PasswordResetOtp {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 10)
    private String otp;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public PasswordResetOtp(String email, String otp, Instant expiresAt) {
        this.email = email;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.used = false;
        this.createdAt = Instant.now();
    }
}
