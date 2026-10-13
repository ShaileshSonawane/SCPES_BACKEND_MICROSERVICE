package com.scpes.matching.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "job_matches")
@Getter
@Setter
@NoArgsConstructor
public class JobMatch {
    @EmbeddedId
    private JobMatchId id;

    @Column(name = "match_score", nullable = false)
    private double matchScore;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "match_matched_skills", joinColumns = {
            @JoinColumn(name = "job_id", referencedColumnName = "job_id"),
            @JoinColumn(name = "student_id", referencedColumnName = "student_id")
    })
    @Column(name = "skill")
    private Set<String> matchedSkills = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "match_missing_skills", joinColumns = {
            @JoinColumn(name = "job_id", referencedColumnName = "job_id"),
            @JoinColumn(name = "student_id", referencedColumnName = "student_id")
    })
    @Column(name = "skill")
    private Set<String> missingSkills = new HashSet<>();

    @Column(name = "forwarded_at")
    private Instant forwardedAt = Instant.now();

    private boolean viewed = false;

    public JobMatch(JobMatchId id, double matchScore, Set<String> matchedSkills, Set<String> missingSkills) {
        this.id = id;
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.forwardedAt = Instant.now();
        this.viewed = false;
    }
}
