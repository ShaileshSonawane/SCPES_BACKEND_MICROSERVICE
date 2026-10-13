package com.scpes.student.repository;

import com.scpes.student.entity.AcademicRecord;
import com.scpes.student.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AcademicRecordRepository extends JpaRepository<AcademicRecord, UUID> {
    List<AcademicRecord> findByVerificationStatus(VerificationStatus status);
}
