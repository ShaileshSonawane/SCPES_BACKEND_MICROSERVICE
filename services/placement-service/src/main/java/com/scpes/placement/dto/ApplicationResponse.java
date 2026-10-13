package com.scpes.placement.dto;

import com.scpes.placement.entity.Application;

import java.time.Instant;
import java.util.UUID;

public record ApplicationResponse(
        UUID id,
        UUID driveId,
        String companyName,
        String role,
        UUID studentId,
        String status,
        Instant appliedAt
) {
    public static ApplicationResponse from(Application a) {
        return new ApplicationResponse(
                a.getId(),
                a.getDrive().getId(),
                a.getDrive().getCompany().getName(),
                a.getDrive().getRole(),
                a.getStudentId(),
                a.getStatus().name(),
                a.getAppliedAt()
        );
    }
}
