package com.scpes.student.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.event.EventEnvelope;
import com.scpes.common.security.SecurityUtils;
import com.scpes.student.dto.AcademicUpdateRequest;
import com.scpes.student.dto.ProfileUpdateRequest;
import com.scpes.student.dto.StudentAcademicUpdated;
import com.scpes.student.dto.StudentProfileResponse;
import com.scpes.student.entity.AcademicRecord;
import com.scpes.student.entity.Student;
import com.scpes.student.entity.VerificationStatus;
import com.scpes.student.repository.AcademicRecordRepository;
import com.scpes.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {
    private final StudentRepository studentRepository;
    private final AcademicRecordRepository recordRepository;
    private final KafkaTemplate<String, Object> kafka;

    @Transactional
    public StudentProfileResponse getMyProfile() {
        var user = SecurityUtils.current();
        Student student = studentRepository.findByUserId(user.userId()).orElseGet(() -> {
            Student s = new Student();
            s.setUserId(user.userId());
            s.setName(user.email().split("@")[0]);
            s.setRollNo("STU-" + user.userId().toString().substring(0, 8).toUpperCase());
            s.setBranch("CSE");
            s.setBatch("2023-2027");
            s.setPassoutYear(2027);

            AcademicRecord a = new AcademicRecord();
            a.setStudent(s);
            a.setStudentId(s.getId());
            a.setVerificationStatus(VerificationStatus.DRAFT);
            s.setAcademicRecord(a);

            return studentRepository.save(s);
        });
        return StudentProfileResponse.from(student);
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getStudentProfile(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Student not found"));
        return StudentProfileResponse.from(student);
    }

    @Transactional
    public StudentProfileResponse updateMyProfile(ProfileUpdateRequest r) {
        UUID userId = SecurityUtils.currentUserId();
        Student s = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Student profile not found"));
        if (r.name() != null) s.setName(r.name());
        if (r.branch() != null) s.setBranch(r.branch());
        if (r.batch() != null) s.setBatch(r.batch());
        if (r.passoutYear() != null) s.setPassoutYear(r.passoutYear());
        if (r.phone() != null) s.setPhone(r.phone());
        if (r.skills() != null) s.setSkills(r.skills());
        s.setUpdatedAt(Instant.now());
        return StudentProfileResponse.from(studentRepository.save(s));
    }

    @Transactional
    public StudentProfileResponse updateMyAcademics(AcademicUpdateRequest r) {
        UUID userId = SecurityUtils.currentUserId();
        Student s = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Student profile not found"));

        AcademicRecord a = s.getAcademicRecord();
        if (a == null) {
            a = new AcademicRecord();
            a.setStudent(s);
            a.setStudentId(s.getId());
            s.setAcademicRecord(a);
        }

        if (a.getVerificationStatus() == VerificationStatus.VERIFIED) {
            throw new BusinessException(HttpStatus.CONFLICT, "Verified data is locked; request faculty/TPO correction");
        }

        a.setTenthPct(r.tenthPct());
        a.setTwelfthPct(r.twelfthPct());
        a.setCgpa(r.cgpa());
        a.setActiveBacklogs(r.activeBacklogs());
        a.setBacklogHistory(r.backlogHistory());
        a.setGapYears(r.gapYears());
        a.setVerificationStatus(VerificationStatus.SUBMITTED);
        a.setUpdatedAt(Instant.now());

        recordRepository.save(a);
        return StudentProfileResponse.from(s);
    }

    @PreAuthorize("hasAuthority('STUDENT_VERIFY') or hasRole('FACULTY') or hasRole('TPO') or hasRole('ADMIN')")
    @Transactional
    public StudentProfileResponse verify(UUID studentId, boolean approve, String remark) {
        AcademicRecord a = recordRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Academic record not found"));

        if (a.getVerificationStatus() != VerificationStatus.SUBMITTED && a.getVerificationStatus() != VerificationStatus.DRAFT) {
            throw new BusinessException(HttpStatus.CONFLICT, "Record is not awaiting verification");
        }

        a.setVerificationStatus(approve ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED);
        a.setVerifiedBy(SecurityUtils.currentUserId());
        a.setVerifiedAt(Instant.now());
        a.setUpdatedAt(Instant.now());
        recordRepository.save(a);

        Student student = a.getStudent();
        log.info("Student {} verification updated to {}. Remark: {}", studentId, a.getVerificationStatus(), remark);

        if (approve) {
            try {
                kafka.send("student.academic.updated", studentId.toString(),
                        EventEnvelope.of("StudentAcademicUpdated", new StudentAcademicUpdated(studentId)));
            } catch (Exception e) {
                log.warn("Kafka event dispatch failed: {}", e.getMessage());
            }
        }

        return StudentProfileResponse.from(student);
    }
}
