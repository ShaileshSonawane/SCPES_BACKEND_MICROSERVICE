package com.scpes.student.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.event.EventEnvelope;
import com.scpes.student.entity.Student;
import com.scpes.student.entity.StudentDocument;
import com.scpes.student.repository.StudentDocumentRepository;
import com.scpes.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {
    private final FileUploadValidator validator;
    private final StudentRepository studentRepository;
    private final StudentDocumentRepository documentRepository;
    private final KafkaTemplate<String, Object> kafka;

    @Transactional
    public void store(UUID userId, MultipartFile file) {
        validator.validate(file);

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Student profile not found"));

        try {
            Path uploadDir = Paths.get(System.getProperty("user.home"), ".scpes", "uploads", "resumes");
            Files.createDirectories(uploadDir);

            String filename = student.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = target.toAbsolutePath().toString();
            StudentDocument doc = new StudentDocument(student.getId(), "RESUME", fileUrl);
            documentRepository.save(doc);

            log.info("Stored resume for student {}: {}", student.getId(), fileUrl);

            // Publish resume.updated event for matching-service
            try {
                kafka.send("resume.updated", student.getId().toString(),
                        EventEnvelope.of("ResumeUpdated", Map.of("studentId", student.getId(), "fileUrl", fileUrl)));
            } catch (Exception e) {
                log.warn("Kafka resume.updated publish failed: {}", e.getMessage());
            }

        } catch (IOException e) {
            log.error("Failed to store resume: {}", e.getMessage());
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
        }
    }
}
