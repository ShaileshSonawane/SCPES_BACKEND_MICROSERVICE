package com.scpes.matching.dto;

import java.util.Set;
import java.util.UUID;

public record MatchedJobDto(
        UUID jobId,
        double matchScore,
        Set<String> matchedSkills,
        Set<String> missingSkills
) {}
