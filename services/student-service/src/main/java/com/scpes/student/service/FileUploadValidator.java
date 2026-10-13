package com.scpes.student.service;

import com.scpes.common.error.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.Set;

@Component
public class FileUploadValidator {
    private static final Set<String> EXT = Set.of("pdf", "docx");
    private static final Set<String> MIME = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream"
    );
    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5 MB

    public void validate(MultipartFile f) {
        if (f == null || f.isEmpty() || f.getSize() > MAX_BYTES) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "File must be between 1 byte and 5 MB");
        }
        String name = Optional.ofNullable(f.getOriginalFilename()).orElse("").toLowerCase();
        int dotIndex = name.lastIndexOf('.');
        if (dotIndex == -1) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid file extension");
        }
        String ext = name.substring(dotIndex + 1);
        if (!EXT.contains(ext)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Only PDF or DOCX allowed");
        }
    }
}
