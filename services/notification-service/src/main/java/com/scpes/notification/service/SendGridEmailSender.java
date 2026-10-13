package com.scpes.notification.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class SendGridEmailSender implements EmailSender {
    private final SendGrid client;
    private final String from;
    private final boolean enabled;

    public SendGridEmailSender(
            @Value("${sendgrid.api-key:}") String key,
            @Value("${sendgrid.from-email:placements@scpes.edu}") String from) {
        this.from = from;
        if (key != null && !key.isBlank()) {
            this.client = new SendGrid(key);
            this.enabled = true;
        } else {
            this.client = null;
            this.enabled = false;
        }
    }

    @Async // Runs on Java 21 virtual threads
    @Override
    public void sendAsync(String to, String subject, String body) {
        if (!enabled || client == null) {
            log.info("[SIMULATED EMAIL] To: {} | Subject: {} | Body: {}", to, subject, body);
            return;
        }

        try {
            Email fromEmail = new Email(from);
            Email toEmail = new Email(to);
            Content content = new Content("text/plain", body);
            Mail mail = new Mail(fromEmail, subject, toEmail, content);

            Request req = new Request();
            req.setMethod(Method.POST);
            req.setEndpoint("mail/send");
            req.setBody(mail.build());

            Response res = client.api(req);
            if (res.getStatusCode() >= 400) {
                log.warn("SendGrid returned status {} for recipient {}", res.getStatusCode(), to);
            } else {
                log.info("Email dispatched via SendGrid to {}", to);
            }
        } catch (IOException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
