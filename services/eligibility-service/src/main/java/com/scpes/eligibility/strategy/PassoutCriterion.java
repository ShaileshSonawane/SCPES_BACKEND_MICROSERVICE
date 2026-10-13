package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record PassoutCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.passoutYear() == null || r.passoutYear() == s.passoutYear()) {
            return Optional.empty();
        }
        return Optional.of("Passout year %d does not match required %d".formatted(s.passoutYear(), r.passoutYear()));
    }
}
