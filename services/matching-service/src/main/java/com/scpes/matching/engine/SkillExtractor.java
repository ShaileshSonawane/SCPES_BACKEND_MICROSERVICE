package com.scpes.matching.engine;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class SkillExtractor {
    private final Map<String, Set<String>> dictionary;
    private final Pattern combined;

    public SkillExtractor(SkillDictionaryLoader loader) {
        this.dictionary = loader.load();
        String all = dictionary.values().stream()
                .flatMap(Set::stream)
                .sorted(Comparator.comparingInt(String::length).reversed()) // longest first: "spring boot" before "spring"
                .map(Pattern::quote)
                .collect(Collectors.joining("|"));

        this.combined = Pattern.compile("(?<![a-z0-9+#])(" + all + ")(?![a-z0-9+#])", Pattern.CASE_INSENSITIVE);
    }

    public Set<String> extract(String normalizedText) {
        Set<String> found = new TreeSet<>();
        Matcher m = combined.matcher(normalizedText);
        while (m.find()) {
            found.add(canonical(m.group(1).toLowerCase()));
        }
        return found;
    }

    private String canonical(String token) {
        return dictionary.entrySet().stream()
                .filter(e -> e.getValue().stream().anyMatch(syn -> syn.equalsIgnoreCase(token)))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(token);
    }
}
