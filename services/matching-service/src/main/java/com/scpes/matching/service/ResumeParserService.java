package com.scpes.matching.service;

import com.scpes.common.error.BusinessException;
import com.scpes.matching.engine.SkillExtractor;
import com.scpes.matching.engine.TextNormalizer;
import com.scpes.matching.entity.ResumeProfile;
import com.scpes.matching.repository.ResumeProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeParserService {
    private final SkillExtractor skillExtractor;
    private final ResumeProfileRepository profiles;
    private final Tika tika = new Tika();

    @Transactional
    public ResumeProfile parseAndStore(UUID studentId, String fileUrl, InputStream in) {
        try {
            String raw = tika.parseToString(in);
            String text = TextNormalizer.normalize(raw);
            Set<String> skills = skillExtractor.extract(text);

            var profile = profiles.findById(studentId).orElseGet(ResumeProfile::new);
            profile.setStudentId(studentId);
            profile.setFileUrl(fileUrl);
            profile.setParsedText(text);
            profile.setExtractedSkills(skills);
            profile.setExperienceYears(BigDecimal.ZERO);
            profile.setUpdatedAt(Instant.now());

            log.info("Parsed resume for student {}: extracted {} skills", studentId, skills.size());
            return profiles.save(profile);
        } catch (IOException | TikaException e) {
            log.error("Could not parse resume: {}", e.getMessage());
            throw new BusinessException(HttpStatus.UNPROCESSABLE_ENTITY, "Could not read resume: " + e.getMessage());
        }
    }

    @Transactional
    public ResumeProfile parseFromPath(UUID studentId, String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Resume file not found at " + filePath);
        }
        try (InputStream in = new FileInputStream(file)) {
            return parseAndStore(studentId, filePath, in);
        } catch (IOException e) {
            throw new BusinessException(HttpStatus.UNPROCESSABLE_ENTITY, "Error opening resume file");
        }
    }
}
