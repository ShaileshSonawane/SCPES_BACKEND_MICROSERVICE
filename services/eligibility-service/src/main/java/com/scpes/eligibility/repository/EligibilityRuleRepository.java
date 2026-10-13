package com.scpes.eligibility.repository;

import com.scpes.eligibility.entity.EligibilityRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EligibilityRuleRepository extends JpaRepository<EligibilityRuleEntity, UUID> {
    Optional<EligibilityRuleEntity> findTopByDriveIdOrderByVersionDesc(UUID driveId);
}
