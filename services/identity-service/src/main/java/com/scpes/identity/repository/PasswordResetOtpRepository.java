package com.scpes.identity.repository;

import com.scpes.identity.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, UUID> {
    Optional<PasswordResetOtp> findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(String email);
    Optional<PasswordResetOtp> findTopByEmailIgnoreCaseAndOtpAndUsedFalseOrderByCreatedAtDesc(String email, String otp);
}
