package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record GapCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.maxGapYears() == null || s.gapYears() <= r.maxGapYears()) {
            return Optional.empty();
        }
        return Optional.of("Education gap %d years exceeds allowed %d".formatted(s.gapYears(), r.maxGapYears()));
    }
}
