package com.scpes.student.dto;

import com.scpes.student.entity.AcademicRecord;
import com.scpes.student.entity.Student;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public record StudentProfileResponse(
        UUID id,
        UUID userId,
        String rollNo,
        String name,
        String branch,
        String batch,
        int passoutYear,
        String phone,
        BigDecimal tenthPct,
        BigDecimal twelfthPct,
        BigDecimal cgpa,
        int activeBacklogs,
        int backlogHistory,
        int gapYears,
        String verificationStatus,
        Set<String> skills
) {
    public static StudentProfileResponse from(Student s) {
        AcademicRecord a = s.getAcademicRecord();
        return new StudentProfileResponse(
                s.getId(),
                s.getUserId(),
                s.getRollNo(),
                s.getName(),
                s.getBranch(),
                s.getBatch(),
                s.getPassoutYear(),
                s.getPhone(),
                a != null ? a.getTenthPct() : null,
                a != null ? a.getTwelfthPct() : null,
                a != null ? a.getCgpa() : null,
                a != null ? a.getActiveBacklogs() : 0,
                a != null ? a.getBacklogHistory() : 0,
                a != null ? a.getGapYears() : 0,
                a != null ? a.getVerificationStatus().name() : "DRAFT",
                s.getSkills()
        );
    }
}
