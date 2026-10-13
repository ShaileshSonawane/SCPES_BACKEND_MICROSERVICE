package com.scpes.matching.controller;

import com.scpes.common.security.SecurityUtils;
import com.scpes.matching.dto.CandidateMatchDto;
import com.scpes.matching.dto.MatchedJobDto;
import com.scpes.matching.model.JobPosting;
import com.scpes.matching.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobMatchController {
    private final MatchingService matchingService;

    @GetMapping("/matched")
    @PreAuthorize("hasRole('STUDENT')")
    public List<MatchedJobDto> getMyMatchedJobs() {
        return matchingService.getMatchedJobsForStudent(SecurityUtils.currentUserId());
    }

    @GetMapping("/{id}/candidates")
    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN') or hasRole('RECRUITER')")
    public List<CandidateMatchDto> getCandidates(@PathVariable UUID id) {
        return matchingService.rankedCandidates(id);
    }

    @PostMapping("/match")
    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN') or hasRole('RECRUITER')")
    public List<CandidateMatchDto> triggerMatch(
            @RequestBody JobPosting job,
            @RequestParam("eligibleStudentIds") Collection<UUID> eligibleIds) {
        return matchingService.matchJob(job, eligibleIds);
    }
}
