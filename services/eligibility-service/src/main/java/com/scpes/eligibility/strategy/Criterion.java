package com.scpes.eligibility.strategy;

import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;

import java.util.Optional;

public sealed interface Criterion permits
        CgpaCriterion, TenthCriterion, TwelfthCriterion, BacklogCriterion,
        BranchCriterion, PassoutCriterion, GapCriterion, SkillCriterion, PolicyCriterion {
    Optional<String> check(StudentSnapshot s, EligibilityRule r);
}
