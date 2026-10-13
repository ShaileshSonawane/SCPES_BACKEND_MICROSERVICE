package com.scpes.eligibility.controller;

import com.scpes.common.security.SecurityUtils;
import com.scpes.eligibility.dto.EligibilityRow;
import com.scpes.eligibility.dto.EvaluationSummary;
import com.scpes.eligibility.dto.RuleVersionResponse;
import com.scpes.eligibility.model.EligibilityRule;
import com.scpes.eligibility.service.EligibilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/drives")
@RequiredArgsConstructor
public class EligibilityController {
    private final EligibilityService service;

    @PutMapping("/{driveId}/rules")
    @PreAuthorize("hasAuthority('RULE_MANAGE') or hasRole('TPO') or hasRole('ADMIN')")
    public RuleVersionResponse saveRules(@PathVariable UUID driveId, @Valid @RequestBody EligibilityRule rule) {
        return service.saveRules(driveId, rule);
    }

    @PostMapping("/{driveId}/evaluate")
    @PreAuthorize("hasAuthority('RULE_MANAGE') or hasRole('TPO') or hasRole('ADMIN')")
    public EvaluationSummary evaluate(@PathVariable UUID driveId) {
        return service.evaluateDrive(driveId);
    }

    @GetMapping("/{driveId}/eligibility")
    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN')")
    public Page<EligibilityRow> list(@PathVariable UUID driveId, Pageable pageable) {
        return service.list(driveId, pageable);
    }

    @GetMapping("/{driveId}/eligibility/me")
    @PreAuthorize("hasRole('STUDENT')")
    public EligibilityRow mine(@PathVariable UUID driveId) {
        return service.forStudent(driveId, SecurityUtils.currentUserId());
    }
}
