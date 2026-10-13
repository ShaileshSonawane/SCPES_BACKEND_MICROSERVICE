package com.scpes.matching.engine;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class TextSimilarity {
    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "in", "on", "of", "for", "to", "with", "at", "by", "from",
            "and", "or", "is", "are", "was", "were", "be", "been", "this", "that", "these", "those",
            "as", "it", "its", "we", "you", "our", "their", "will", "can", "have", "has", "had"
    );

    public double cosine(String resume, String jobDescription) {
        if (resume == null || jobDescription == null || resume.isBlank() || jobDescription.isBlank()) {
            return 0.0;
        }
        Map<String, Integer> a = termFreq(resume);
        Map<String, Integer> b = termFreq(jobDescription);
        Set<String> vocab = new HashSet<>(a.keySet());
        vocab.addAll(b.keySet());

        double dot = 0, na = 0, nb = 0;
        for (String t : vocab) {
            int df = (a.containsKey(t) ? 1 : 0) + (b.containsKey(t) ? 1 : 0);
            double idf = Math.log(1.0 + 2.0 / df); // smoothed idf, 2 docs
            double wa = a.getOrDefault(t, 0) * idf;
            double wb = b.getOrDefault(t, 0) * idf;
            dot += wa * wb;
            na += wa * wa;
            nb += wb * wb;
        }
        return (na == 0 || nb == 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
    }

    private Map<String, Integer> termFreq(String text) {
        Map<String, Integer> tf = new HashMap<>();
        for (String w : text.toLowerCase().split("\\s+")) {
            if (w.length() > 2 && !STOP_WORDS.contains(w)) {
                tf.merge(w, 1, Integer::sum);
            }
        }
        return tf;
    }
}
