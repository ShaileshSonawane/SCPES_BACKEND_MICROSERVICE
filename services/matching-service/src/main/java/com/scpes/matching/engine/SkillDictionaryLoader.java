package com.scpes.matching.engine;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
@Slf4j
public class SkillDictionaryLoader {
    private final ObjectMapper mapper = new ObjectMapper();

    public Map<String, Set<String>> load() {
        try {
            ClassPathResource res = new ClassPathResource("skills.json");
            try (InputStream in = res.getInputStream()) {
                return mapper.readValue(in, new TypeReference<Map<String, Set<String>>>() {});
            }
        } catch (Exception e) {
            log.warn("Could not load skills.json: {}. Using fallback dictionary.", e.getMessage());
            Map<String, Set<String>> fallback = new HashMap<>();
            fallback.put("java", Set.of("java", "core java"));
            fallback.put("spring boot", Set.of("spring boot", "springboot"));
            fallback.put("sql", Set.of("sql", "mysql", "postgresql"));
            fallback.put("python", Set.of("python"));
            return fallback;
        }
    }
}
