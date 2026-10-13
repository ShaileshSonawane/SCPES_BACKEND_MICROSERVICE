package com.scpes.eligibility.dto;

import java.util.List;
import java.util.UUID;

public record EligibilityRow(
        UUID driveId,
        UUID studentId,
        boolean eligible,
        List<String> reasons
) {}
