package com.scpes.eligibility.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EligibilityRule(
        UUID driveId,
        Double minCgpa,
        Double min10th,
        Double min12th,
        Integer maxActiveBacklogs,
        Integer maxBacklogHistory,
        Set<String> allowedBranches,
        Integer passoutYear,
        Integer maxGapYears,
        Set<String> requiredSkillsAny,
        PlacementPolicy policy
) {}
