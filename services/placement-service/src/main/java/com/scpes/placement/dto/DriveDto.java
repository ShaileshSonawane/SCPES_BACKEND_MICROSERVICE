package com.scpes.placement.dto;

import com.scpes.placement.entity.Drive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record DriveDto(
        UUID id,
        UUID companyId,
        String companyName,
        String role,
        BigDecimal ctc,
        LocalDate driveDate,
        LocalDate lastApplyDate,
        String status,
        String category
) {
    public static DriveDto from(Drive d) {
        return new DriveDto(
                d.getId(),
                d.getCompany().getId(),
                d.getCompany().getName(),
                d.getRole(),
                d.getCtc(),
                d.getDriveDate(),
                d.getLastApplyDate(),
                d.getStatus().name(),
                d.getCategory()
        );
    }
}
