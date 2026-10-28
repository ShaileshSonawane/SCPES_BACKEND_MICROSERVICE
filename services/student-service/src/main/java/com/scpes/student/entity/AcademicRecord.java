package com.scpes.student.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "academic_records")
@Getter
@Setter
@NoArgsConstructor
public class AcademicRecord {
    @Id
    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "tenth_pct")
    private BigDecimal tenthPct;

    @Column(name = "twelfth_pct")
    private BigDecimal twelfthPct;

    private BigDecimal cgpa;

    @Column(name = "active_backlogs")
    private int activeBacklogs = 0;

    @Column(name = "backlog_history")
    private int backlogHistory = 0;

    @Column(name = "gap_years")
    private int gapYears = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus = VerificationStatus.DRAFT;

    @Column(name = "verified_by")
    private UUID verifiedBy;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-ACR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
