package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record TenthCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.min10th() == null || s.tenthPct() >= r.min10th()) {
            return Optional.empty();
        }
        return Optional.of("10th percentage %.2f%% < required %.2f%%".formatted(s.tenthPct(), r.min10th()));
    }
}
