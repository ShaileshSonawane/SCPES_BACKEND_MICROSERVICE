package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public record SkillCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.requiredSkillsAny() == null || r.requiredSkillsAny().isEmpty()) {
            return Optional.empty();
        }
        if (s.skills() == null || s.skills().isEmpty()) {
            return Optional.of("None of required skills " + r.requiredSkillsAny() + " found in profile");
        }
        Set<String> have = s.skills().stream().map(String::toLowerCase).collect(Collectors.toSet());
        boolean any = r.requiredSkillsAny().stream().anyMatch(k -> have.contains(k.toLowerCase()));
        return any ? Optional.empty()
                : Optional.of("None of required skills " + r.requiredSkillsAny() + " found in profile");
    }
}
