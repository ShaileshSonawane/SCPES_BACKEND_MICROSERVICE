package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record BranchCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.allowedBranches() == null || r.allowedBranches().isEmpty() || r.allowedBranches().contains(s.branch())) {
            return Optional.empty();
        }
        return Optional.of("Branch " + s.branch() + " not allowed");
    }
}
