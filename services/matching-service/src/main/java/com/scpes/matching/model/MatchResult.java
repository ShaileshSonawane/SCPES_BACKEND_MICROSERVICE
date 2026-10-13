package com.scpes.matching.model;

import java.util.Set;

public sealed interface MatchResult {
    record Rejected(Set<String> missingMustHave) implements MatchResult {}
    record Scored(double score, Set<String> matchedSkills, Set<String> missingKeySkills) implements MatchResult {}
}
