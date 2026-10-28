package com.scpes.notification.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(name = "recipient_id", nullable = false)
    private UUID recipientId;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "text", nullable = false)
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Notification(UUID recipientId, String type, String message) {
        this.recipientId = recipientId;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.createdAt = Instant.now();
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-NTF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
