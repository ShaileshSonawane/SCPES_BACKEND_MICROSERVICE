package com.scpes.report.dto;

import java.math.BigDecimal;
import java.util.Map;

public record DepartmentSummary(
        Map<String, BigDecimal> placementPercentByDepartment,
        Map<String, Object> packageStats
) {}
