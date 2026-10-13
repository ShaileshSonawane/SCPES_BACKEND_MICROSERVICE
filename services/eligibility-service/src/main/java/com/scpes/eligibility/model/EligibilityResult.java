package com.scpes.eligibility.model;

import java.util.List;
import java.util.UUID;

public record EligibilityResult(
        UUID studentId,
        boolean eligible,
        List<String> reasons
) {}
