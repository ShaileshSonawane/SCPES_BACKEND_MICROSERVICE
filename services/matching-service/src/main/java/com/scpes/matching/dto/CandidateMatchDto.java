package com.scpes.matching.dto;

import java.util.Set;
import java.util.UUID;

public record CandidateMatchDto(
        UUID studentId,
        double matchScore,
        Set<String> matchedSkills,
        Set<String> missingSkills
) {}
