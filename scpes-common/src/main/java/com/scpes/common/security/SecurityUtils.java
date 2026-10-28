package com.scpes.common.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class SecurityUtils {
    private SecurityUtils() {}

    public static UserPrincipal current() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal up)) {
            throw new AccessDeniedException("Unauthenticated");
        }
        return up;
    }

    public static UUID currentUserId() {
        return current().userId();
    }

    public static String currentScpeId() {
        return current().scpeId();
    }
}
