package com.scpes.matching.repository;

import com.scpes.matching.entity.JobMatch;
import com.scpes.matching.entity.JobMatchId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface JobMatchRepository extends JpaRepository<JobMatch, JobMatchId> {
    @Query("SELECT m FROM JobMatch m WHERE m.id.studentId = :studentId ORDER BY m.matchScore DESC")
    List<JobMatch> findByStudentId(@Param("studentId") UUID studentId);

    @Query("SELECT m FROM JobMatch m WHERE m.id.jobId = :jobId ORDER BY m.matchScore DESC")
    List<JobMatch> findByJobIdOrderByMatchScoreDesc(@Param("jobId") UUID jobId);

    @Query("SELECT m FROM JobMatch m WHERE m.id.jobId = :jobId ORDER BY m.matchScore ASC")
    List<JobMatch> findByJobIdOrderByMatchScoreAsc(@Param("jobId") UUID jobId);
}
