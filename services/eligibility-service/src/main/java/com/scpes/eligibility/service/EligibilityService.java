package com.scpes.eligibility.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scpes.common.error.BusinessException;
import com.scpes.common.security.SecurityUtils;
import com.scpes.eligibility.client.StudentQueryClient;
import com.scpes.eligibility.dto.EligibilityRow;
import com.scpes.eligibility.dto.EvaluationSummary;
import com.scpes.eligibility.dto.RuleVersionResponse;
import com.scpes.eligibility.entity.EligibilityResultEntity;
import com.scpes.eligibility.entity.EligibilityResultId;
import com.scpes.eligibility.entity.EligibilityRuleEntity;
import com.scpes.eligibility.evaluator.EligibilityEvaluator;
import com.scpes.eligibility.model.EligibilityResult;
import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.model.StudentSnapshot;
import com.scpes.eligibility.repository.EligibilityResultRepository;
import com.scpes.eligibility.repository.EligibilityRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
@Slf4j
public class EligibilityService {
    private final EligibilityRuleRepository rules;
    private final EligibilityResultRepository results;
    private final StudentQueryClient students;
    private final EligibilityEvaluator evaluator;
    private final ObjectMapper mapper;

    @Transactional
    public RuleVersionResponse saveRules(UUID driveId, EligibilityRule rule) {
        int nextVersion = rules.findTopByDriveIdOrderByVersionDesc(driveId)
                .map(r -> r.getVersion() + 1)
                .orElse(1);

        try {
            EligibilityRuleEntity entity = new EligibilityRuleEntity();
            entity.setDriveId(driveId);
            entity.setVersion(nextVersion);
            entity.setRuleJson(mapper.writeValueAsString(rule));
            try {
                entity.setCreatedBy(SecurityUtils.currentUserId());
            } catch (Exception ignored) {}
            rules.save(entity);
            return new RuleVersionResponse(driveId, nextVersion);
        } catch (JsonProcessingException e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid rule JSON format");
        }
    }

    @Transactional
    public EvaluationSummary evaluateDrive(UUID driveId) {
        var ruleEntity = rules.findTopByDriveIdOrderByVersionDesc(driveId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "No rule set found for drive: " + driveId));

        EligibilityRule rule = readRule(ruleEntity);
        List<StudentSnapshot> snapshots = students.fetchVerified(rule.passoutYear(), rule.allowedBranches());

        List<EligibilityResult> evaluated;
        try (var exec = Executors.newVirtualThreadPerTaskExecutor()) { // Java 21 Virtual Threads
            List<Future<EligibilityResult>> futures = snapshots.stream()
                    .map(s -> exec.submit(() -> evaluator.evaluate(s, rule)))
                    .toList();
            evaluated = futures.stream().map(this::joinFuture).toList();
        }

        saveInBatches(driveId, ruleEntity.getVersion(), evaluated);
        long eligibleCount = evaluated.stream().filter(EligibilityResult::eligible).count();
        log.info("Drive {} evaluated: {}/{} eligible students", driveId, eligibleCount, evaluated.size());

        return new EvaluationSummary(driveId, evaluated.size(), eligibleCount);
    }

    @Transactional(readOnly = true)
    public EligibilityRow forStudent(UUID driveId, UUID studentId) {
        EligibilityResultId id = new EligibilityResultId(driveId, studentId);
        return results.findById(id)
                .map(this::toRow)
                .orElseGet(() -> new EligibilityRow(driveId, studentId, false, List.of("Not yet evaluated for this drive")));
    }

    @Transactional(readOnly = true)
    public Page<EligibilityRow> list(UUID driveId, Pageable pageable) {
        Page<EligibilityResultEntity> page = results.findByDriveId(driveId, pageable);
        List<EligibilityRow> rows = page.getContent().stream().map(this::toRow).toList();
        return new PageImpl<>(rows, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<UUID> getEligibleStudentIds(UUID driveId) {
        return results.findEligibleByDriveId(driveId).stream()
                .map(r -> r.getId().getStudentId())
                .toList();
    }

    @Transactional
    public void reEvaluateStudentForOpenDrives(UUID studentId) {
        log.info("Re-evaluating student {} against open drives...", studentId);
        // Find all unique drives and re-evaluate for this student
        List<EligibilityRuleEntity> allRules = rules.findAll();
        for (EligibilityRuleEntity ruleEntity : allRules) {
            try {
                evaluateDrive(ruleEntity.getDriveId());
            } catch (Exception e) {
                log.warn("Re-evaluation skipped for drive {}: {}", ruleEntity.getDriveId(), e.getMessage());
            }
        }
    }

    private EligibilityRule readRule(EligibilityRuleEntity entity) {
        try {
            return mapper.readValue(entity.getRuleJson(), EligibilityRule.class);
        } catch (JsonProcessingException e) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse rule entity JSON");
        }
    }

    private <T> T joinFuture(Future<T> f) {
        try {
            return f.get();
        } catch (Exception e) {
            throw new IllegalStateException("Virtual thread task failed: " + e.getMessage(), e);
        }
    }

    private void saveInBatches(UUID driveId, int version, List<EligibilityResult> list) {
        results.deleteByDriveId(driveId);
        for (int i = 0; i < list.size(); i += 500) {
            List<EligibilityResult> chunk = list.subList(i, Math.min(i + 500, list.size()));
            List<EligibilityResultEntity> entities = chunk.stream().map(r -> {
                String reasonsJson;
                try {
                    reasonsJson = mapper.writeValueAsString(r.reasons());
                } catch (Exception e) {
                    reasonsJson = "[]";
                }
                return new EligibilityResultEntity(
                        new EligibilityResultId(driveId, r.studentId()),
                        r.eligible(),
                        reasonsJson,
                        version
                );
            }).toList();
            results.saveAll(entities);
        }
    }

    private EligibilityRow toRow(EligibilityResultEntity entity) {
        List<String> reasons;
        try {
            reasons = mapper.readValue(entity.getReasons(), new TypeReference<List<String>>() {});
        } catch (Exception e) {
            reasons = List.of();
        }
        return new EligibilityRow(
                entity.getId().getDriveId(),
                entity.getId().getStudentId(),
                entity.isEligible(),
                reasons
        );
    }
}
