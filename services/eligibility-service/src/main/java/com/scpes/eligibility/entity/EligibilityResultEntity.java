package com.scpes.eligibility.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "eligibility_results")
@Getter
@Setter
@NoArgsConstructor
public class EligibilityResultEntity {
    @EmbeddedId
    private EligibilityResultId id;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(nullable = false)
    private boolean eligible;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private String reasons;

    @Column(name = "rule_version", nullable = false)
    private int ruleVersion;

    @Column(name = "evaluated_at")
    private Instant evaluatedAt = Instant.now();

    public EligibilityResultEntity(EligibilityResultId id, boolean eligible, String reasons, int ruleVersion) {
        this.id = id;
        this.eligible = eligible;
        this.reasons = reasons;
        this.ruleVersion = ruleVersion;
        this.evaluatedAt = Instant.now();
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-ELG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
