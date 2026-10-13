package com.scpes.eligibility.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "eligibility_rules")
@Getter
@Setter
@NoArgsConstructor
public class EligibilityRuleEntity {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "drive_id", nullable = false)
    private UUID driveId;

    @Column(name = "rule_json", nullable = false, columnDefinition = "jsonb")
    private String ruleJson;

    @Column(nullable = false)
    private int version = 1;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
