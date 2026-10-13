package com.scpes.report.controller;

import com.scpes.report.dto.DepartmentSummary;
import com.scpes.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/department-summary")
    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN') or hasRole('FACULTY')")
    public DepartmentSummary getDepartmentSummary(@RequestParam(value = "year", defaultValue = "2027") int year) {
        return reportService.departmentSummary(year);
    }

    @GetMapping(value = "/drive/{id}/export", produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("hasRole('TPO') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportDriveReport(@PathVariable UUID id) {
        byte[] pdfBytes = reportService.drivePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"drive-report-" + id + ".pdf\"")
                .body(pdfBytes);
    }
}
