package com.scpes.eligibility.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "processed_events")
@Getter
@Setter
@NoArgsConstructor
public class ProcessedEventEntity {
    @Id
    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(name = "processed_at")
    private Instant processedAt = Instant.now();

    public ProcessedEventEntity(UUID eventId) {
        this.eventId = eventId;
        this.processedAt = Instant.now();
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
