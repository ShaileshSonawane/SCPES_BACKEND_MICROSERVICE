package com.scpes.placement.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.event.EventEnvelope;
import com.scpes.common.security.SecurityUtils;
import com.scpes.placement.client.EligibilityCheckResult;
import com.scpes.placement.client.EligibilityClient;
import com.scpes.placement.dto.ApplicationResponse;
import com.scpes.placement.dto.UpdateApplicationStatusRequest;
import com.scpes.placement.entity.*;
import com.scpes.placement.repository.ApplicationRepository;
import com.scpes.placement.repository.DriveRepository;
import com.scpes.placement.repository.PlacementResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final DriveRepository driveRepository;
    private final PlacementResultRepository resultRepository;
    private final EligibilityClient eligibilityClient;
    private final KafkaTemplate<String, Object> kafka;

    @Transactional
    public ApplicationResponse apply(UUID driveId) {
        UUID studentId = SecurityUtils.currentUserId();
        Drive d = driveRepository.findById(driveId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Drive not found"));

        if (d.getStatus() != DriveStatus.OPEN) {
            throw new BusinessException(HttpStatus.CONFLICT, "Drive is not open for applications");
        }

        if (d.getLastApplyDate() != null && LocalDate.now().isAfter(d.getLastApplyDate())) {
            throw new BusinessException(HttpStatus.CONFLICT, "Applications for this drive are closed");
        }

        if (applicationRepository.existsByDriveIdAndStudentId(driveId, studentId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Already applied to this drive");
        }

        // Authoritative gRPC eligibility check
        EligibilityCheckResult check = eligibilityClient.check(driveId, studentId);
        if (!check.eligible()) {
            throw new BusinessException(HttpStatus.FORBIDDEN,
                    "Student not eligible for this drive: " + String.join(", ", check.reasons()));
        }

        Application app = Application.create(d, studentId);
        app = applicationRepository.save(app);
        log.info("Student {} applied to drive {}", studentId, driveId);

        try {
            kafka.send("application.status.changed", app.getId().toString(),
                    EventEnvelope.of("ApplicationSubmitted", Map.of(
                            "applicationId", app.getId(),
                            "driveId", driveId,
                            "studentId", studentId,
                            "status", app.getStatus().name()
                    )));
        } catch (Exception e) {
            log.warn("Kafka event dispatch failed: {}", e.getMessage());
        }

        return ApplicationResponse.from(app);
    }

    @PreAuthorize("hasAuthority('RESULT_MANAGE') or hasRole('TPO') or hasRole('ADMIN')")
    @Transactional
    public ApplicationResponse updateStatus(UUID applicationId, UpdateApplicationStatusRequest req) {
        Application a = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application not found"));

        a.transitionTo(req.status());
        a = applicationRepository.save(a);

        if (req.status() == ApplicationStatus.SELECTED && req.packageAmount() != null) {
            PlacementResult res = new PlacementResult();
            res.setApplication(a);
            res.setRoundNo(3);
            res.setResult("SELECTED");
            res.setPackageAmount(req.packageAmount());
            resultRepository.save(res);
        }

        log.info("Application {} transitioned to {}", applicationId, req.status());

        try {
            kafka.send("application.status.changed", a.getId().toString(),
                    EventEnvelope.of("ApplicationStatusChanged", Map.of(
                            "applicationId", a.getId(),
                            "studentId", a.getStudentId(),
                            "status", a.getStatus().name(),
                            "remark", req.resultRemark() != null ? req.resultRemark() : ""
                    )));
        } catch (Exception e) {
            log.warn("Kafka event dispatch failed: {}", e.getMessage());
        }

        return ApplicationResponse.from(a);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        UUID studentId = SecurityUtils.currentUserId();
        return applicationRepository.findByStudentId(studentId).stream()
                .map(ApplicationResponse::from)
                .toList();
    }

    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getDriveApplications(UUID driveId) {
        return applicationRepository.findByDriveId(driveId).stream()
                .map(ApplicationResponse::from)
                .toList();
    }
}
