package com.scpes.identity.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@Slf4j
public class EmailService {

    @Value("${sendgrid.api-key:}")
    private String sendGridApiKey;

    @Value("${sendgrid.from-email:placements@scpes.edu}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "SCPES Account Password Reset Verification OTP";
        String body = """
                Hello,
                
                You requested a password reset for your SCPES account.
                
                Your 6-digit verification OTP is:
                    [%s]
                
                This code is valid for 10 minutes. If you did not request this, please ignore this email.
                
                Best regards,
                SCPES Placement Cell
                """.formatted(otp);

        log.info("""
                
                ============================================================
                📧 [SCPES EMAIL DISPATCH]
                To:       {}
                Subject:  {}
                OTP Code: {}
                Validity: 10 minutes
                ============================================================
                """, toEmail, subject, otp);

        if (sendGridApiKey != null && !sendGridApiKey.isBlank()) {
            sendViaSendGrid(toEmail, subject, body);
        }
    }

    private void sendViaSendGrid(String to, String subject, String body) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();

            String escapedBody = body.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\r", "")
                    .replace("\n", "\\n");

            String payload = """
                    {
                      "personalizations": [{"to": [{"email": "%s"}]}],
                      "from": {"email": "%s", "name": "SCPES Placement Cell"},
                      "subject": "%s",
                      "content": [{"type": "text/plain", "value": "%s"}]
                    }
                    """.formatted(to, fromEmail, subject, escapedBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.sendgrid.com/v3/mail/send"))
                    .header("Authorization", "Bearer " + sendGridApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("SendGrid email successfully sent to {}", to);
            } else {
                log.warn("SendGrid returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send email via SendGrid to {}: {}", to, e.getMessage());
        }
    }
}
