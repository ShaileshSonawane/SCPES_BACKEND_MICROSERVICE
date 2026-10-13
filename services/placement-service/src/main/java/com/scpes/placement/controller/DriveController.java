package com.scpes.placement.controller;

import com.scpes.common.security.SecurityUtils;
import com.scpes.placement.client.EligibilityClient;
import com.scpes.placement.dto.CreateDriveRequest;
import com.scpes.placement.dto.DriveDto;
import com.scpes.placement.entity.DriveStatus;
import com.scpes.placement.service.DriveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/drives")
@RequiredArgsConstructor
public class DriveController {
    private final DriveService driveService;
    private final EligibilityClient eligibilityClient;

    @PostMapping
    @PreAuthorize("hasAuthority('DRIVE_CREATE') or hasRole('TPO') or hasRole('ADMIN')")
    public DriveDto create(@Valid @RequestBody CreateDriveRequest req) {
        return driveService.createDrive(req);
    }

    @GetMapping
    public List<DriveDto> list() {
        return driveService.getAllDrives();
    }

    @GetMapping("/{id}")
    public DriveDto getById(@PathVariable UUID id) {
        return driveService.getDrive(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('DRIVE_CREATE') or hasRole('TPO') or hasRole('ADMIN')")
    public DriveDto updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        DriveStatus status = DriveStatus.valueOf(body.get("status"));
        return driveService.changeStatus(id, status);
    }

    @GetMapping("/eligible")
    @PreAuthorize("hasRole('STUDENT')")
    public List<DriveDto> getEligibleDrivesForStudent() {
        UUID studentId = SecurityUtils.currentUserId();
        List<DriveDto> openDrives = driveService.getOpenDrives();
        return openDrives.stream()
                .filter(d -> eligibilityClient.check(d.id(), studentId).eligible())
                .toList();
    }
}
