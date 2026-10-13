package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record PolicyCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.policy() == null) {
            return Optional.empty();
        }
        return switch (r.policy()) {
            case NONE -> Optional.empty();
            case ONE_OFFER -> s.alreadyPlaced()
                    ? Optional.of("Already placed (One-Offer policy)")
                    : Optional.empty();
            case DREAM -> (s.alreadyPlaced() && s.bestPackageLpa() >= 6.0)
                    ? Optional.of("Already placed with package >= 6 LPA (Dream policy)")
                    : Optional.empty();
            case SUPER_DREAM -> (s.alreadyPlaced() && s.bestPackageLpa() >= 12.0)
                    ? Optional.of("Already placed with package >= 12 LPA (Super-Dream policy)")
                    : Optional.empty();
        };
    }
}
