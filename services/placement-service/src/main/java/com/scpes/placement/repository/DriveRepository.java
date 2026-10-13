package com.scpes.placement.repository;

import com.scpes.placement.entity.Drive;
import com.scpes.placement.entity.DriveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DriveRepository extends JpaRepository<Drive, UUID> {
    List<Drive> findByStatus(DriveStatus status);

    @Query("SELECT d FROM Drive d WHERE d.status = 'OPEN' AND d.lastApplyDate = :date")
    List<Drive> findClosingOn(@Param("date") LocalDate date);
}
