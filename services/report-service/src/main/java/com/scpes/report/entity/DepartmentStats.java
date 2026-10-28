package com.scpes.report.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "department_stats")
public class DepartmentStats {
    @EmbeddedId
    private DepartmentYearId id;

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(name = "placement_pct")
    private BigDecimal placementPct;

    @Column(name = "highest_package")
    private BigDecimal highestPackage;

    @Column(name = "average_package")
    private BigDecimal averagePackage;

    @Column(name = "median_package")
    private BigDecimal medianPackage;

    public DepartmentStats() {}

    public DepartmentStats(DepartmentYearId id, BigDecimal placementPct, BigDecimal highestPackage, BigDecimal averagePackage, BigDecimal medianPackage) {
        this.id = id;
        this.placementPct = placementPct;
        this.highestPackage = highestPackage;
        this.averagePackage = averagePackage;
        this.medianPackage = medianPackage;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public DepartmentYearId getId() {
        return id;
    }

    public void setId(DepartmentYearId id) {
        this.id = id;
    }

    public String getScpeId() {
        return scpeId;
    }

    public void setScpeId(String scpeId) {
        this.scpeId = scpeId;
    }

    public BigDecimal getPlacementPct() {
        return placementPct;
    }

    public void setPlacementPct(BigDecimal placementPct) {
        this.placementPct = placementPct;
    }

    public BigDecimal getHighestPackage() {
        return highestPackage;
    }

    public void setHighestPackage(BigDecimal highestPackage) {
        this.highestPackage = highestPackage;
    }

    public BigDecimal getAveragePackage() {
        return averagePackage;
    }

    public void setAveragePackage(BigDecimal averagePackage) {
        this.averagePackage = averagePackage;
    }

    public BigDecimal getMedianPackage() {
        return medianPackage;
    }

    public void setMedianPackage(BigDecimal medianPackage) {
        this.medianPackage = medianPackage;
    }
}
