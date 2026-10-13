package com.scpes.student.dto;

import java.util.Set;

public record ProfileUpdateRequest(
        String name,
        String branch,
        String batch,
        Integer passoutYear,
        String phone,
        Set<String> skills
) {}
