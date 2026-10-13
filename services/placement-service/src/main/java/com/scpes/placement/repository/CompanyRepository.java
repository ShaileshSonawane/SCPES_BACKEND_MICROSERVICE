package com.scpes.placement.repository;

import com.scpes.placement.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByNameIgnoreCase(String name);
}
