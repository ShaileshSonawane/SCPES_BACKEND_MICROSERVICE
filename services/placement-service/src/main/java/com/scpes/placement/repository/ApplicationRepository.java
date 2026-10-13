package com.scpes.placement.repository;

import com.scpes.placement.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Application a WHERE a.drive.id = :driveId AND a.studentId = :studentId")
    boolean existsByDriveIdAndStudentId(@Param("driveId") UUID driveId, @Param("studentId") UUID studentId);

    List<Application> findByStudentId(UUID studentId);

    @Query("SELECT a FROM Application a WHERE a.drive.id = :driveId")
    List<Application> findByDriveId(@Param("driveId") UUID driveId);

    @Query("SELECT a FROM Application a WHERE a.drive.id = :driveId AND a.studentId = :studentId")
    Optional<Application> findByDriveIdAndStudentId(@Param("driveId") UUID driveId, @Param("studentId") UUID studentId);
}
