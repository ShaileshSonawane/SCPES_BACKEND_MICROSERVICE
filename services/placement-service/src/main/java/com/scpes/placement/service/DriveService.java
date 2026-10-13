package com.scpes.placement.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.event.EventEnvelope;
import com.scpes.placement.client.EligibilityClient;
import com.scpes.placement.dto.CreateDriveRequest;
import com.scpes.placement.dto.CreateRoundRequest;
import com.scpes.placement.dto.DriveDto;
import com.scpes.placement.entity.Company;
import com.scpes.placement.entity.Drive;
import com.scpes.placement.entity.DriveRound;
import com.scpes.placement.entity.DriveStatus;
import com.scpes.placement.repository.CompanyRepository;
import com.scpes.placement.repository.DriveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DriveService {
    private final DriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final EligibilityClient eligibilityClient;
    private final KafkaTemplate<String, Object> kafka;

    @PreAuthorize("hasAuthority('DRIVE_CREATE') or hasRole('TPO') or hasRole('ADMIN')")
    @Transactional
    public DriveDto createDrive(CreateDriveRequest req) {
        Company company = companyRepository.findById(req.companyId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Company not found"));

        Drive d = new Drive();
        d.setCompany(company);
        d.setRole(req.role());
        d.setCtc(req.ctc());
        d.setDriveDate(req.driveDate());
        d.setLastApplyDate(req.lastApplyDate() != null ? req.lastApplyDate() : LocalDate.now().plusDays(7));
        d.setCategory(req.category() != null ? req.category() : "STANDARD");
        d.setStatus(DriveStatus.DRAFT);

        if (req.rounds() != null) {
            for (CreateRoundRequest r : req.rounds()) {
                d.getRounds().add(new DriveRound(d, r.roundNo(), r.type(), r.date()));
            }
        } else {
            // Default round progression: Aptitude -> Technical -> HR
            d.getRounds().add(new DriveRound(d, 1, "Aptitude", d.getDriveDate()));
            d.getRounds().add(new DriveRound(d, 2, "Technical", d.getDriveDate() != null ? d.getDriveDate().plusDays(2) : null));
            d.getRounds().add(new DriveRound(d, 3, "HR", d.getDriveDate() != null ? d.getDriveDate().plusDays(4) : null));
        }

        d = driveRepository.save(d);
        log.info("Created placement drive: {} for company {}", d.getId(), company.getName());
        return DriveDto.from(d);
    }

    @PreAuthorize("hasAuthority('DRIVE_CREATE') or hasRole('TPO') or hasRole('ADMIN')")
    @Transactional
    public DriveDto changeStatus(UUID driveId, DriveStatus next) {
        Drive d = driveRepository.findById(driveId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Drive not found"));

        d.moveTo(next);
        d = driveRepository.save(d);
        log.info("Drive {} moved to status {}", driveId, next);

        if (next == DriveStatus.OPEN) {
            // Evaluate students via gRPC and publish drive.opened event
            List<UUID> eligible = eligibilityClient.evaluateDrive(driveId);
            try {
                kafka.send("drive.opened", driveId.toString(),
                        EventEnvelope.of("DriveOpened", Map.of(
                                "driveId", driveId,
                                "role", d.getRole(),
                                "company", d.getCompany().getName(),
                                "eligibleStudentIds", eligible
                        )));
            } catch (Exception e) {
                log.warn("Kafka drive.opened dispatch failed: {}", e.getMessage());
            }
        }

        if (next == DriveStatus.RESULT_PUBLISHED) {
            try {
                kafka.send("result.published", driveId.toString(),
                        EventEnvelope.of("ResultPublished", Map.of("driveId", driveId, "role", d.getRole())));
            } catch (Exception e) {
                log.warn("Kafka result.published dispatch failed: {}", e.getMessage());
            }
        }

        return DriveDto.from(d);
    }

    @Transactional(readOnly = true)
    public List<DriveDto> getAllDrives() {
        return driveRepository.findAll().stream().map(DriveDto::from).toList();
    }

    @Transactional(readOnly = true)
    public DriveDto getDrive(UUID id) {
        return driveRepository.findById(id)
                .map(DriveDto::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Drive not found"));
    }

    @Transactional(readOnly = true)
    public List<DriveDto> getOpenDrives() {
        return driveRepository.findByStatus(DriveStatus.OPEN).stream().map(DriveDto::from).toList();
    }

    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Kolkata")
    public void remindDeadlines() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Drive> closingSoon = driveRepository.findClosingOn(tomorrow);
        for (Drive d : closingSoon) {
            try {
                kafka.send("notification.send", d.getId().toString(),
                        EventEnvelope.of("DeadlineReminder", Map.of(
                                "driveId", d.getId(),
                                "role", d.getRole(),
                                "company", d.getCompany().getName(),
                                "deadline", d.getLastApplyDate()
                        )));
            } catch (Exception e) {
                log.warn("Kafka reminder dispatch failed: {}", e.getMessage());
            }
        }
    }
}
