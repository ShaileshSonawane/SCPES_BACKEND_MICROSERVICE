package com.scpes.matching.service;

import com.scpes.common.event.EventEnvelope;
import com.scpes.matching.dto.CandidateMatchDto;
import com.scpes.matching.dto.MatchedJobDto;
import com.scpes.matching.engine.MatchScorer;
import com.scpes.matching.entity.JobMatch;
import com.scpes.matching.entity.JobMatchId;
import com.scpes.matching.entity.ResumeProfile;
import com.scpes.matching.model.JobPosting;
import com.scpes.matching.model.MatchResult;
import com.scpes.matching.repository.JobMatchRepository;
import com.scpes.matching.repository.ResumeProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {
    private final ResumeProfileRepository profiles;
    private final JobMatchRepository matches;
    private final MatchScorer scorer;
    private final KafkaTemplate<String, Object> kafka;

    @Transactional
    public List<CandidateMatchDto> matchJob(JobPosting job, Collection<UUID> eligibleIds) {
        List<ResumeProfile> resumes = profiles.findAllById(eligibleIds);
        double threshold = job.minMatchScore() == null ? 60.0 : job.minMatchScore();
        List<JobMatch> forwarded = new ArrayList<>();

        try (var exec = Executors.newVirtualThreadPerTaskExecutor()) { // Java 21
            var futures = resumes.stream()
                    .map(r -> exec.submit(() -> Map.entry(r, scorer.match(r, job))))
                    .toList();

            for (var f : futures) {
                try {
                    var entry = f.get();
                    if (entry.getValue() instanceof MatchResult.Scored s && s.score() >= threshold) {
                        forwarded.add(new JobMatch(
                                new JobMatchId(job.id(), entry.getKey().getStudentId()),
                                s.score(),
                                s.matchedSkills(),
                                s.missingKeySkills()
                        ));
                    }
                } catch (Exception e) {
                    log.warn("Scoring task error: {}", e.getMessage());
                }
            }
        }

        matches.saveAll(forwarded);
        List<UUID> ids = forwarded.stream().map(m -> m.getId().getStudentId()).toList();

        try {
            kafka.send("job.matched", job.id().toString(),
                    EventEnvelope.of("JobMatched", Map.of(
                            "jobId", job.id(),
                            "title", job.title(),
                            "studentIds", ids
                    )));
        } catch (Exception e) {
            log.warn("Kafka job.matched dispatch failed: {}", e.getMessage());
        }

        log.info("Job {}: {} of {} eligible students forwarded above threshold {}",
                job.id(), ids.size(), resumes.size(), threshold);

        return forwarded.stream().map(m -> new CandidateMatchDto(
                m.getId().getStudentId(),
                m.getMatchScore(),
                m.getMatchedSkills(),
                m.getMissingSkills()
        )).toList();
    }

    @Transactional(readOnly = true)
    public List<CandidateMatchDto> rankedCandidates(UUID jobId) {
        return matches.findByJobIdOrderByMatchScoreDesc(jobId).stream()
                .map(m -> new CandidateMatchDto(
                        m.getId().getStudentId(),
                        m.getMatchScore(),
                        m.getMatchedSkills(),
                        m.getMissingSkills()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MatchedJobDto> getMatchedJobsForStudent(UUID studentId) {
        return matches.findByStudentId(studentId).stream()
                .map(m -> new MatchedJobDto(
                        m.getId().getJobId(),
                        m.getMatchScore(),
                        m.getMatchedSkills(),
                        m.getMissingSkills()
                ))
                .toList();
    }
}
