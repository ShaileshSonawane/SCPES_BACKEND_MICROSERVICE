package com.scpes.eligibility.dto;

import java.util.UUID;

public record EvaluationSummary(
        UUID driveId,
        int total,
        long eligible
) {}
