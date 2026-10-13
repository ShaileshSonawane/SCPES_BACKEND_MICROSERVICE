package com.scpes.placement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateDriveRequest(
        @NotNull UUID companyId,
        @NotBlank String role,
        BigDecimal ctc,
        LocalDate driveDate,
        LocalDate lastApplyDate,
        String category,
        List<CreateRoundRequest> rounds
) {}
