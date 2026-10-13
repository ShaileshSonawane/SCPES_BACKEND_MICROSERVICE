package com.scpes.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "placement_results")
@Getter
@Setter
@NoArgsConstructor
public class PlacementResult {
    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "round_no", nullable = false)
    private int roundNo;

    @Column(nullable = false)
    private String result; // SELECTED, REJECTED, ON_HOLD

    private BigDecimal packageAmount;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
