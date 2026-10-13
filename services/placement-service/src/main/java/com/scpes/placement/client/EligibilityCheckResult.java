package com.scpes.placement.client;

import java.util.List;

public record EligibilityCheckResult(
        boolean eligible,
        List<String> reasons
) {}
