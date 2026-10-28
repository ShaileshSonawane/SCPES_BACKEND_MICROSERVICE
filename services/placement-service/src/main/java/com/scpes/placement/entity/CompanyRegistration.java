package com.scpes.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "company_registrations")
@Getter
@Setter
@NoArgsConstructor
public class CompanyRegistration implements Persistable<UUID> {
    @Id
    @Column(name = "company_id")
    private UUID companyId;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "contact_email", nullable = false, unique = true)
    private String contactEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Transient
    private boolean isNew = true;

    @Override
    public UUID getId() {
        return companyId;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostLoad
    @PostPersist
    void markNotNew() {
        this.isNew = false;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-REG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public CompanyRegistration(Company company, String contactEmail) {
        this.company = company;
        this.companyId = company != null ? company.getId() : null;
        this.contactEmail = contactEmail;
        this.status = RegistrationStatus.PENDING;
        this.isNew = true;
    }
}
