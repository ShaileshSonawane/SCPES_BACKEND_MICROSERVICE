package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public record BacklogCriterion() implements Criterion {
    @Override
    public Optional<String> check(StudentSnapshot s, EligibilityRule r) {
        if (r.maxActiveBacklogs() != null && s.activeBacklogs() > r.maxActiveBacklogs()) {
            return Optional.of("Active backlogs %d exceed limit %d".formatted(s.activeBacklogs(), r.maxActiveBacklogs()));
        }
        if (r.maxBacklogHistory() != null && s.backlogHistory() > r.maxBacklogHistory()) {
            return Optional.of("Backlog history %d exceeds limit %d".formatted(s.backlogHistory(), r.maxBacklogHistory()));
        }
        return Optional.empty();
    }
}
