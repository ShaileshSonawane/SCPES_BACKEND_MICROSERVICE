package com.scpes.report.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DepartmentYearId implements Serializable {
    private String department;
    private int year;

    public DepartmentYearId() {}

    public DepartmentYearId(String department, int year) {
        this.department = department;
        this.year = year;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DepartmentYearId that = (DepartmentYearId) o;
        return year == that.year && Objects.equals(department, that.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(department, year);
    }
}
