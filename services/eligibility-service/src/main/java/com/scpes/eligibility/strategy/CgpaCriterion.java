package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record CgpaCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.minCgpa() == null || s.cgpa() >= r.minCgpa()) {
            return Optional.empty();
        }
        return Optional.of("CGPA %.2f < required %.2f".formatted(s.cgpa(), r.minCgpa()));
    }
}
