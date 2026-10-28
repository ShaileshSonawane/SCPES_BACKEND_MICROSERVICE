package com.scpes.identity.controller;

import com.scpes.common.security.SecurityUtils;
import com.scpes.identity.dto.*;
import com.scpes.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody Map<String, String> body) {
        return authService.refresh(body.get("refreshToken"));
    }

    @PostMapping("/change-password")
    public void changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        authService.changePassword(SecurityUtils.currentUserId(), req);
    }

    @PostMapping("/forgot-password")
    public AuthMessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        return authService.sendForgotPasswordOtp(req.email());
    }

    @PostMapping("/reset-password")
    public AuthMessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        return authService.resetPassword(req);
    }

    @PostMapping("/register-recruiter")
    public TokenResponse registerRecruiter(@Valid @RequestBody RecruiterRegisterRequest req) {
        return authService.registerRecruiter(req);
    }

    @PostMapping("/register-student")
    public TokenResponse registerStudent(@Valid @RequestBody StudentRegisterRequest req) {
        return authService.registerStudent(req);
    }
}
