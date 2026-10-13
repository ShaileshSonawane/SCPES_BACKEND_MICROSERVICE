package com.scpes.eligibility.model;

import java.util.Set;
import java.util.UUID;

public record StudentSnapshot(
        UUID studentId,
        String branch,
        int passoutYear,
        double tenthPct,
        double twelfthPct,
        double cgpa,
        int activeBacklogs,
        int backlogHistory,
        int gapYears,
        Set<String> skills,
        boolean alreadyPlaced,
        double bestPackageLpa
) {}
