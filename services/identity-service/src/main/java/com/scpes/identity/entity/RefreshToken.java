package com.scpes.identity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
public class RefreshToken {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "token_hash", nullable = false)
    private String tokenHash;

    private boolean revoked = false;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public RefreshToken(UUID userId, String tokenHash, Instant expiresAt) {
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-TOK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
