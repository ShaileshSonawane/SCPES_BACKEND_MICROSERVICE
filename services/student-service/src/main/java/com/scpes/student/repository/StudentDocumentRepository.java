package com.scpes.student.repository;

import com.scpes.student.entity.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentDocumentRepository extends JpaRepository<StudentDocument, UUID> {
    List<StudentDocument> findByStudentId(UUID studentId);
    Optional<StudentDocument> findTopByStudentIdAndTypeOrderByUploadedAtDesc(UUID studentId, String type);
}
