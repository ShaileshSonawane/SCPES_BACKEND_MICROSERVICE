package com.scpes.placement.controller;

import com.scpes.placement.dto.ApplicationResponse;
import com.scpes.placement.dto.UpdateApplicationStatusRequest;
import com.scpes.placement.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/drives/{id}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ApplicationResponse apply(@PathVariable UUID id) {
        return applicationService.apply(id);
    }

    @GetMapping("/applications/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<ApplicationResponse> getMyApplications() {
        return applicationService.getMyApplications();
    }

    @GetMapping("/drives/{id}/applications")
    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN')")
    public List<ApplicationResponse> getDriveApplications(@PathVariable UUID id) {
        return applicationService.getDriveApplications(id);
    }

    @PatchMapping("/applications/{id}/status")
    @PreAuthorize("hasAuthority('RESULT_MANAGE') or hasRole('TPO') or hasRole('ADMIN')")
    public ApplicationResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateApplicationStatusRequest req) {
        return applicationService.updateStatus(id, req);
    }
}
