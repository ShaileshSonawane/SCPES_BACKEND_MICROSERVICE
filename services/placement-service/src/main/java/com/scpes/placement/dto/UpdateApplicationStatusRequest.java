package com.scpes.placement.dto;

import com.scpes.placement.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateApplicationStatusRequest(
        @NotNull ApplicationStatus status,
        String resultRemark,
        BigDecimal packageAmount
) {}
