package com.scpes.common.security;

import java.util.Set;
import java.util.UUID;

public record UserPrincipal(
        UUID userId,
        String email,
        String role,
        Set<String> permissions
) {}
