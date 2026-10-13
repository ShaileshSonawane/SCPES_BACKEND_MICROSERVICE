package com.scpes.matching.repository;

import com.scpes.matching.entity.ResumeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ResumeProfileRepository extends JpaRepository<ResumeProfile, UUID> {
}
