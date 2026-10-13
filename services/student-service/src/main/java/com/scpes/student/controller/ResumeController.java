package com.scpes.student.controller;

import com.scpes.common.security.SecurityUtils;
import com.scpes.student.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/students/me")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumes;

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> upload(@RequestPart("file") MultipartFile file) {
        resumes.store(SecurityUtils.currentUserId(), file);
        return ResponseEntity.accepted().build();
    }
}
