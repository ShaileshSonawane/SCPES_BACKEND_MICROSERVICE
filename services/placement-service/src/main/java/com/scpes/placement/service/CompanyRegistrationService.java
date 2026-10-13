package com.scpes.placement.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.event.EventEnvelope;
import com.scpes.common.security.SecurityUtils;
import com.scpes.placement.dto.CompanyDto;
import com.scpes.placement.dto.CompanyRegisterRequest;
import com.scpes.placement.entity.Company;
import com.scpes.placement.entity.CompanyRegistration;
import com.scpes.placement.entity.RegistrationStatus;
import com.scpes.placement.repository.CompanyRegistrationRepository;
import com.scpes.placement.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyRegistrationService {
    private final CompanyRepository companyRepository;
    private final CompanyRegistrationRepository registrationRepository;
    private final KafkaTemplate<String, Object> kafka;

    @Transactional
    public CompanyDto register(CompanyRegisterRequest r) {
        if (registrationRepository.existsByContactEmailIgnoreCase(r.contactEmail())) {
            throw new BusinessException(HttpStatus.CONFLICT, "Company with contact email already registered");
        }
        Company c = new Company(r.name(), r.sector(), r.website(), r.description());
        c = companyRepository.save(c);

        CompanyRegistration reg = new CompanyRegistration(c, r.contactEmail());
        registrationRepository.save(reg);

        log.info("Company registered (pending approval): {} ({})", c.getName(), c.getId());

        try {
            kafka.send("company.registered", c.getId().toString(),
                    EventEnvelope.of("CompanyRegistered", Map.of("companyId", c.getId(), "name", c.getName(), "email", r.contactEmail())));
        } catch (Exception e) {
            log.warn("Kafka event dispatch failed: {}", e.getMessage());
        }

        return CompanyDto.from(c);
    }

    @PreAuthorize("hasAuthority('COMPANY_APPROVE') or hasRole('TPO') or hasRole('ADMIN')")
    @Transactional
    public void decide(UUID companyId, boolean approve) {
        CompanyRegistration reg = registrationRepository.findById(companyId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Company registration not found"));

        reg.setStatus(approve ? RegistrationStatus.APPROVED : RegistrationStatus.REJECTED);
        reg.setApprovedBy(SecurityUtils.currentUserId());
        registrationRepository.save(reg);
        log.info("Company {} status updated to {}", companyId, reg.getStatus());
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream().map(CompanyDto::from).toList();
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompany(UUID id) {
        return companyRepository.findById(id)
                .map(CompanyDto::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Company not found"));
    }
}
