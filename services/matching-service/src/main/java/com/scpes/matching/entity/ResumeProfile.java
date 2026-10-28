package com.scpes.matching.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "resume_profiles")
@Getter
@Setter
@NoArgsConstructor
public class ResumeProfile {
    @Id
    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "parsed_text", columnDefinition = "text", nullable = false)
    private String parsedText;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resume_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill")
    private Set<String> extractedSkills = new HashSet<>();

    @Column(name = "experience_years")
    private BigDecimal experienceYears = BigDecimal.ZERO;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-RSM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
