package com.scpes.identity.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.security.JwtService;
import com.scpes.identity.dto.ChangePasswordRequest;
import com.scpes.identity.dto.LoginRequest;
import com.scpes.identity.dto.TokenResponse;
import com.scpes.identity.entity.Permission;
import com.scpes.identity.entity.RefreshToken;
import com.scpes.identity.entity.User;
import com.scpes.identity.entity.UserStatus;
import com.scpes.identity.repository.RefreshTokenRepository;
import com.scpes.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @Transactional
    public TokenResponse login(LoginRequest req) {
        User u = users.findByEmailIgnoreCase(req.email())
                .filter(x -> x.getStatus() == UserStatus.ACTIVE)
                .filter(x -> encoder.matches(req.password(), x.getPasswordHash()))
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
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

    private TokenResponse issue(User u) {
        Set<String> perms = u.getRole().getPermissions().stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());
        String access = jwt.generateAccessToken(u.getId(), u.getEmail(), u.getRole().getName(), perms);
        String refresh = jwt.generateRefreshToken(u.getId());
        refreshTokens.save(new RefreshToken(u.getId(), sha256(refresh), Instant.now().plus(7, ChronoUnit.DAYS)));
        return new TokenResponse(access, refresh, 3600, u.getRole().getName(), u.getId(), u.getEmail(), u.getUserCode());
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
