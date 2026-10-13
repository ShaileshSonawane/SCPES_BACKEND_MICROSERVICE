package com.scpes.eligibility.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "eligibility_results")
@Getter
@Setter
@NoArgsConstructor
public class EligibilityResultEntity {
    @EmbeddedId
    private EligibilityResultId id;

    @Column(nullable = false)
    private boolean eligible;

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
}
