package com.scpes.placement.controller;

import com.scpes.placement.dto.CompanyDto;
import com.scpes.placement.dto.CompanyRegisterRequest;
import com.scpes.placement.service.CompanyRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyRegistrationService registrationService;

    @PostMapping("/register")
    public CompanyDto register(@Valid @RequestBody CompanyRegisterRequest req) {
        return registrationService.register(req);
    }

    @PatchMapping("/{id}/approval")
    @PreAuthorize("hasAuthority('COMPANY_APPROVE') or hasRole('TPO') or hasRole('ADMIN')")
    public void decide(@PathVariable UUID id, @RequestBody Map<String, Boolean> body) {
        boolean approve = Boolean.TRUE.equals(body.get("approve"));
        registrationService.decide(id, approve);
    }

    @GetMapping
    public List<CompanyDto> list() {
        return registrationService.getAllCompanies();
    }

    @GetMapping("/{id}")
    public CompanyDto getById(@PathVariable UUID id) {
        return registrationService.getCompany(id);
    }
}
