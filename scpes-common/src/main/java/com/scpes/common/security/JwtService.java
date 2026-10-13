package com.scpes.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

public class JwtService {
    private final SecretKey key;

    public JwtService(String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UUID userId, String email, String role, Set<String> perms) {
        return build(userId, email, role, perms, 3600); // 1 hour
    }

    public String generateRefreshToken(UUID userId) {
        return build(userId, null, null, Set.of(), 7 * 24 * 3600); // 7 days
    }

    private String build(UUID id, String email, String role, Set<String> perms, long ttlSec) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .subject(id.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(ttlSec)));

        if (email != null) builder.claim("email", email);
        if (role != null) builder.claim("role", role);
        if (perms != null && !perms.isEmpty()) builder.claim("perms", perms);

        return builder.signWith(key).compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
