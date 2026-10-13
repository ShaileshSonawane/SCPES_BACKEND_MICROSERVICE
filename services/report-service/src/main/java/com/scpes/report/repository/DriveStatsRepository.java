package com.scpes.report.repository;

import com.scpes.report.entity.DriveStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DriveStatsRepository extends JpaRepository<DriveStats, UUID> {
}
