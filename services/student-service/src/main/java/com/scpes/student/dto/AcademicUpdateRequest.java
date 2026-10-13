package com.scpes.student.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AcademicUpdateRequest(
        @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal tenthPct,
        @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal twelfthPct,
        @NotNull @DecimalMin("0") @DecimalMax("10") BigDecimal cgpa,
        @Min(0) int activeBacklogs,
        @Min(0) int backlogHistory,
        @Min(0) int gapYears
) {}
