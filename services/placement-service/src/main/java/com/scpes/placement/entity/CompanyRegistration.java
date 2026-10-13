package com.scpes.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "company_registrations")
@Getter
@Setter
@NoArgsConstructor
public class CompanyRegistration {
    @Id
    @Column(name = "company_id")
    private UUID companyId;

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

    public CompanyRegistration(Company company, String contactEmail) {
        this.company = company;
        this.companyId = company.getId();
        this.contactEmail = contactEmail;
        this.status = RegistrationStatus.PENDING;
    }
}
