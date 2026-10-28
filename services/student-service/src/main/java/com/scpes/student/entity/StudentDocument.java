package com.scpes.student.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "student_documents")
@Getter
@Setter
@NoArgsConstructor
public class StudentDocument {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(nullable = false)
    private String type; // RESUME, MARKSHEET, CERTIFICATE

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "uploaded_at")
    private Instant uploadedAt = Instant.now();

    public StudentDocument(UUID studentId, String type, String fileUrl) {
        this.studentId = studentId;
        this.type = type;
        this.fileUrl = fileUrl;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
