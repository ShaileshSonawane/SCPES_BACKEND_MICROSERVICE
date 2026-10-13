package com.scpes.matching.engine;

import com.scpes.matching.entity.ResumeProfile;
import com.scpes.matching.model.JobPosting;
import com.scpes.matching.model.MatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MatchScorer {
    private final TextSimilarity similarity;

    public MatchResult match(ResumeProfile r, JobPosting j) {
        Set<String> have = lower(r.getExtractedSkills());
        Set<String> must = lower(j.mustHaveSkills());
        Set<String> key = lower(j.keySkills());

        Set<String> missingMust = new TreeSet<>(must);
        missingMust.removeAll(have);
        if (!missingMust.isEmpty()) {
            return new MatchResult.Rejected(missingMust); // hard gate
        }

        Set<String> matchedKey = new TreeSet<>(key);
        matchedKey.retainAll(have);
        Set<String> missingKey = new TreeSet<>(key);
        missingKey.removeAll(have);

        double mustScore = 1.0;
        double keyScore = key.isEmpty() ? 1.0 : (double) matchedKey.size() / key.size();
        double textScore = similarity.cosine(r.getParsedText(), j.description());

        double score = 100 * (0.50 * mustScore + 0.30 * keyScore + 0.20 * textScore);

        Set<String> matched = new TreeSet<>(must);
        matched.addAll(matchedKey);

        return new MatchResult.Scored(Math.round(score * 100) / 100.0, matched, missingKey);
    }

    private Set<String> lower(Set<String> in) {
        if (in == null) return Set.of();
        return in.stream().map(String::toLowerCase).collect(Collectors.toSet());
    }
}
