package com.scpes.student.controller;

import com.scpes.student.dto.AcademicUpdateRequest;
import com.scpes.student.dto.ProfileUpdateRequest;
import com.scpes.student.dto.StudentProfileResponse;
import com.scpes.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileResponse getMe() {
        return studentService.getMyProfile();
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileResponse updateProfile(@Valid @RequestBody ProfileUpdateRequest req) {
        return studentService.updateMyProfile(req);
    }

    @PutMapping("/me/academics")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileResponse updateAcademics(@Valid @RequestBody AcademicUpdateRequest req) {
        return studentService.updateMyAcademics(req);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('TPO') or hasRole('FACULTY') or hasRole('ADMIN')")
    public StudentProfileResponse getById(@PathVariable UUID id) {
        return studentService.getStudentProfile(id);
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasAuthority('STUDENT_VERIFY') or hasRole('FACULTY') or hasRole('TPO') or hasRole('ADMIN')")
    public StudentProfileResponse verify(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        boolean approve = Boolean.TRUE.equals(body.get("approve"));
        String remark = (String) body.getOrDefault("remark", "");
        return studentService.verify(id, approve, remark);
    }
}
