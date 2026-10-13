package com.scpes.report.repository;

import com.scpes.report.entity.DepartmentStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepartmentStatsRepository extends JpaRepository<DepartmentStats, Object> {
    @Query("SELECT d FROM DepartmentStats d WHERE d.id.year = :year")
    List<DepartmentStats> findByYear(@Param("year") int year);
}
