package com.scpes.matching.model;

import java.util.Set;
import java.util.UUID;

public record JobPosting(
        UUID id,
        String title,
        String description,
        Set<String> mustHaveSkills,
        Set<String> keySkills,
        Double minMatchScore
) {}
