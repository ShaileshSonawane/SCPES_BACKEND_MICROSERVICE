package com.scpes.placement.entity;

import com.scpes.common.error.BusinessException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
public class Application {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drive_id", nullable = false)
    private Drive drive;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "applied_at")
    private Instant appliedAt = Instant.now();

    public static Application create(Drive drive, UUID studentId) {
        Application a = new Application();
        a.setDrive(drive);
        a.setStudentId(studentId);
        a.setStatus(ApplicationStatus.APPLIED);
        a.setAppliedAt(Instant.now());
        return a;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-APP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public void transitionTo(ApplicationStatus next) {
        if (!this.status.canMoveTo(next)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Cannot transition application from " + this.status + " to " + next);
        }
        this.status = next;
    }
}
