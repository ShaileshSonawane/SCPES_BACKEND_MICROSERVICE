package com.scpes.identity.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.security.JwtService;
import com.scpes.identity.dto.*;
import com.scpes.identity.entity.*;
import com.scpes.identity.repository.PasswordResetOtpRepository;
import com.scpes.identity.repository.RefreshTokenRepository;
import com.scpes.identity.repository.RoleRepository;
import com.scpes.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository users;
    private final RoleRepository roles;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordResetOtpRepository passwordResetOtps;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public TokenResponse login(LoginRequest req) {
        String identifier = req.scpeId() != null && !req.scpeId().isBlank()
                ? req.scpeId().trim()
                : (req.email() != null ? req.email().trim() : "");

        User u = users.findByScpeIdIgnoreCase(identifier)
                .or(() -> users.findByEmailIgnoreCase(identifier))
                .or(() -> users.findByUserCodeIgnoreCase(identifier))
                .filter(x -> x.getStatus() == UserStatus.ACTIVE)
                .filter(x -> encoder.matches(req.password(), x.getPasswordHash()))
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Invalid credentials for identifier: " + identifier));
        return issue(u);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Refresh token required");
        }
        String hash = sha256(refreshToken);
        var stored = refreshTokens.findByTokenHashAndRevokedFalse(hash)
                .filter(t -> t.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token"));
        stored.setRevoked(true); // rotate: old token cannot be reused
        return issue(users.getReferenceById(stored.getUserId()));
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest req) {
        User user = users.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "User not found"));
        if (!encoder.matches(req.oldPassword(), user.getPasswordHash())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Old password does not match");
        }
        user.setPasswordHash(encoder.encode(req.newPassword()));
        users.save(user);
    }

    @Transactional
    public AuthMessageResponse sendForgotPasswordOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        User user = users.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "No registered account found with email: " + cleanEmail));

        // Generate 6-digit cryptographic OTP
        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));
        Instant expiresAt = Instant.now().plus(10, ChronoUnit.MINUTES);

        PasswordResetOtp resetOtp = new PasswordResetOtp(cleanEmail, otp, expiresAt);
        passwordResetOtps.save(resetOtp);

        // Send OTP email
        emailService.sendOtpEmail(cleanEmail, otp);

        return new AuthMessageResponse(
                true,
                "A 6-digit verification code has been dispatched to " + cleanEmail + ". Enter the OTP below and set your new password.",
                cleanEmail,
                user.getScpeId(),
                otp
        );
    }

    @Transactional
    public AuthMessageResponse resetPassword(ResetPasswordRequest req) {
        String cleanEmail = req.email().trim().toLowerCase();
        String cleanOtp = req.otp().trim();

        PasswordResetOtp otpRecord = passwordResetOtps
                .findTopByEmailIgnoreCaseAndOtpAndUsedFalseOrderByCreatedAtDesc(cleanEmail, cleanOtp)
                .filter(o -> o.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "Invalid or expired OTP code. Please request a new code."));

        User user = users.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "User account not found"));

        // Set confirmed new password in database
        user.setPasswordHash(encoder.encode(req.newPassword()));
        users.save(user);

        // Mark OTP as used
        otpRecord.setUsed(true);
        passwordResetOtps.save(otpRecord);

        log.info("Password reset successfully for user {} ({})", user.getEmail(), user.getScpeId());

        return new AuthMessageResponse(
                true,
                "Password updated successfully in database! You can now log in with your new password.",
                cleanEmail,
                user.getScpeId(),
                null
        );
    }

    @Transactional
    public TokenResponse registerRecruiter(RecruiterRegisterRequest req) {
        String cleanEmail = req.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(cleanEmail)) {
            throw new BusinessException(HttpStatus.CONFLICT, "An account with email " + cleanEmail + " is already registered.");
        }

        Role recruiterRole = roles.findByName("RECRUITER")
                .orElseGet(() -> {
                    Role r = new Role("RECRUITER");
                    r.setScpeId("SCPE-ROL-RECRUITER");
                    return roles.save(r);
                });

        int suffixNum = 100 + RANDOM.nextInt(900);
        String userCode = "REC" + suffixNum;
        String scpeId = "SCPE-REC-" + suffixNum;

        // Ensure uniqueness
        while (users.existsByUserCodeIgnoreCase(userCode) || users.existsByScpeIdIgnoreCase(scpeId)) {
            suffixNum = 100 + RANDOM.nextInt(900);
            userCode = "REC" + suffixNum;
            scpeId = "SCPE-REC-" + suffixNum;
        }

        User newUser = new User();
        newUser.setId(UUID.randomUUID());
        newUser.setEmail(cleanEmail);
        newUser.setUserCode(userCode);
        newUser.setScpeId(scpeId);
        newUser.setPasswordHash(encoder.encode(req.password()));
        newUser.setRole(recruiterRole);
        newUser.setStatus(UserStatus.ACTIVE);
        newUser = users.save(newUser);

        log.info("Registered new corporate recruiter: {} ({}, {}) for company: {}",
                cleanEmail, userCode, scpeId, req.companyName());

        return issue(newUser);
    }

    @Transactional
    public TokenResponse registerStudent(StudentRegisterRequest req) {
        String cleanEmail = req.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(cleanEmail)) {
            throw new BusinessException(HttpStatus.CONFLICT, "An account with email " + cleanEmail + " is already registered.");
        }

        Role studentRole = roles.findByName("STUDENT")
                .orElseGet(() -> {
                    Role r = new Role("STUDENT");
                    r.setScpeId("SCPE-ROL-STUDENT");
                    return roles.save(r);
                });

        int suffixNum = 100 + RANDOM.nextInt(900);
        String userCode = "STU" + suffixNum;
        String scpeId = "SCPE-STU-" + suffixNum;

        while (users.existsByUserCodeIgnoreCase(userCode) || users.existsByScpeIdIgnoreCase(scpeId)) {
            suffixNum = 100 + RANDOM.nextInt(900);
            userCode = "STU" + suffixNum;
            scpeId = "SCPE-STU-" + suffixNum;
        }

        User newUser = new User();
        newUser.setId(UUID.randomUUID());
        newUser.setEmail(cleanEmail);
        newUser.setUserCode(userCode);
        newUser.setScpeId(scpeId);
        newUser.setPasswordHash(encoder.encode(req.password()));
        newUser.setRole(studentRole);
        newUser.setStatus(UserStatus.ACTIVE);
        newUser = users.save(newUser);

        log.info("Registered new student: {} ({}, {}) roll: {}",
                cleanEmail, userCode, scpeId, req.rollNo());

        return issue(newUser);
    }

    private TokenResponse issue(User u) {
        Set<String> perms = u.getRole().getPermissions().stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());
        String access = jwt.generateAccessToken(u.getId(), u.getEmail(), u.getRole().getName(), perms, u.getScpeId());
        String refresh = jwt.generateRefreshToken(u.getId());
        refreshTokens.save(new RefreshToken(u.getId(), sha256(refresh), Instant.now().plus(7, ChronoUnit.DAYS)));
        return new TokenResponse(access, refresh, 3600, u.getRole().getName(), u.getId(), u.getEmail(), u.getUserCode(), u.getScpeId());
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
