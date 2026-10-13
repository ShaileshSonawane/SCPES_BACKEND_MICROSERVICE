package com.scpes.student.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
}
