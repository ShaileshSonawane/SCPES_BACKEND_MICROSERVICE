package com.scpes.eligibility.repository;

import com.scpes.eligibility.entity.EligibilityResultEntity;
import com.scpes.eligibility.entity.EligibilityResultId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EligibilityResultRepository extends JpaRepository<EligibilityResultEntity, EligibilityResultId> {
    Optional<EligibilityResultEntity> findById(EligibilityResultId id);

    @Query("SELECT r FROM EligibilityResultEntity r WHERE r.id.driveId = :driveId")
    Page<EligibilityResultEntity> findByDriveId(@Param("driveId") UUID driveId, Pageable pageable);

    @Query("SELECT r FROM EligibilityResultEntity r WHERE r.id.driveId = :driveId AND r.eligible = true")
    List<EligibilityResultEntity> findEligibleByDriveId(@Param("driveId") UUID driveId);

    @Query("SELECT r FROM EligibilityResultEntity r WHERE r.id.studentId = :studentId AND r.eligible = true")
    List<EligibilityResultEntity> findEligibleByStudentId(@Param("studentId") UUID studentId);

    @Modifying
    @Query("DELETE FROM EligibilityResultEntity r WHERE r.id.driveId = :driveId")
    void deleteByDriveId(@Param("driveId") UUID driveId);
}
