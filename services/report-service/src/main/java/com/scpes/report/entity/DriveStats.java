package com.scpes.report.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "drive_stats")
public class DriveStats {
    @Id
    @Column(name = "drive_id")
    private UUID driveId;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    private String role;

    @Column(name = "total_eligible")
    private int totalEligible = 0;

    @Column(name = "total_applied")
    private int totalApplied = 0;

    @Column(name = "total_shortlisted")
    private int totalShortlisted = 0;

    @Column(name = "total_selected")
    private int totalSelected = 0;

    public DriveStats() {}

    public DriveStats(UUID driveId, String role, int totalEligible, int totalApplied, int totalShortlisted, int totalSelected) {
        this.driveId = driveId;
        this.role = role;
        this.totalEligible = totalEligible;
        this.totalApplied = totalApplied;
        this.totalShortlisted = totalShortlisted;
        this.totalSelected = totalSelected;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-DST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public UUID getDriveId() {
        return driveId;
    }

    public void setDriveId(UUID driveId) {
        this.driveId = driveId;
    }

    public String getScpeId() {
        return scpeId;
    }

    public void setScpeId(String scpeId) {
        this.scpeId = scpeId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getTotalEligible() {
        return totalEligible;
    }

    public void setTotalEligible(int totalEligible) {
        this.totalEligible = totalEligible;
    }

    public int getTotalApplied() {
        return totalApplied;
    }

    public void setTotalApplied(int totalApplied) {
        this.totalApplied = totalApplied;
    }

    public int getTotalShortlisted() {
        return totalShortlisted;
    }

    public void setTotalShortlisted(int totalShortlisted) {
        this.totalShortlisted = totalShortlisted;
    }

    public int getTotalSelected() {
        return totalSelected;
    }

    public void setTotalSelected(int totalSelected) {
        this.totalSelected = totalSelected;
    }
}
