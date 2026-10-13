package com.scpes.eligibility.evaluator;

import com.scpes.eligibility.model.EligibilityResult;
import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;
import com.scpes.eligibility.strategy.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class EligibilityEvaluator {
    private final List<Criterion> criteria = List.of(
            new CgpaCriterion(),
            new TenthCriterion(),
            new TwelfthCriterion(),
            new BacklogCriterion(),
            new BranchCriterion(),
            new PassoutCriterion(),
            new GapCriterion(),
            new SkillCriterion(),
            new PolicyCriterion()
    );

    public EligibilityResult evaluate(StudentSnapshot s, EligibilityRule r) {
        List<String> reasons = criteria.stream()
                .map(c -> c.check(s, r))
                .flatMap(Optional::stream)
                .toList();
        return new EligibilityResult(s.studentId(), reasons.isEmpty(), reasons);
    }
}
