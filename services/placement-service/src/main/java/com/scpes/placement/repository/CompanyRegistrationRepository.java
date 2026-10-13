package com.scpes.placement.repository;

import com.scpes.placement.entity.CompanyRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompanyRegistrationRepository extends JpaRepository<CompanyRegistration, UUID> {
    Optional<CompanyRegistration> findByContactEmailIgnoreCase(String contactEmail);
    boolean existsByContactEmailIgnoreCase(String contactEmail);
}
