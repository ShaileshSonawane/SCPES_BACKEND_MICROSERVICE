package com.scpes.placement.repository;

import com.scpes.placement.entity.PlacementResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PlacementResultRepository extends JpaRepository<PlacementResult, UUID> {
    @Query("SELECT r FROM PlacementResult r WHERE r.application.id = :applicationId")
    List<PlacementResult> findByApplicationId(@Param("applicationId") UUID applicationId);
}
