package com.scpes.placement.repository;

import com.scpes.placement.entity.DriveRound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DriveRoundRepository extends JpaRepository<DriveRound, UUID> {
    List<DriveRound> findByDriveIdOrderByRoundNoAsc(UUID driveId);
}
