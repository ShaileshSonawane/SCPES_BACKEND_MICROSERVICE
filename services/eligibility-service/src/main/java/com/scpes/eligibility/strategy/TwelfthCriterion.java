package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record TwelfthCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.min12th() == null || s.twelfthPct() >= r.min12th()) {
            return Optional.empty();
        }
        return Optional.of("12th percentage %.2f%% < required %.2f%%".formatted(s.twelfthPct(), r.min12th()));
    }
}
