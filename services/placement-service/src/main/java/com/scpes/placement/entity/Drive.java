package com.scpes.placement.entity;

import com.scpes.common.error.BusinessException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "drives")
@Getter
@Setter
@NoArgsConstructor
public class Drive {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String role;

    private BigDecimal ctc;

    @Column(name = "drive_date")
    private LocalDate driveDate;

    @Column(name = "last_apply_date")
    private LocalDate lastApplyDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriveStatus status = DriveStatus.DRAFT;

    private String category;

    @OneToMany(mappedBy = "drive", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DriveRound> rounds = new ArrayList<>();

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-DRV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public void moveTo(DriveStatus next) {
        if (!this.status.canMoveTo(next)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Invalid drive status transition from " + this.status + " to " + next);
        }
        this.status = next;
        this.updatedAt = Instant.now();
    }
}
