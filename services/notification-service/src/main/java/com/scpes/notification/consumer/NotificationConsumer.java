package com.scpes.notification.consumer;

import com.scpes.common.event.EventEnvelope;
import com.scpes.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {
    private final NotificationService notifications;

    @KafkaListener(topics = "drive.opened", groupId = "notification-service")
    public void onDriveOpened(EventEnvelope<Map<String, Object>> e, Acknowledgment ack) {
        try {
            Map<String, Object> p = e.payload();
            String role = (String) p.get("role");
            String company = (String) p.get("company");
            Object ids = p.get("eligibleStudentIds");
            if (ids instanceof Collection<?> coll) {
                for (Object idObj : coll) {
                    UUID id = UUID.fromString(idObj.toString());
                    notifications.send(id, "NEW_DRIVE", "New placement drive opened: " + company + " (" + role + ")");
                }
            }
        } catch (Exception ex) {
            log.warn("Error handling drive.opened: {}", ex.getMessage());
        } finally {
            ack.acknowledge();
        }
    }

    @KafkaListener(topics = "job.matched", groupId = "notification-service")
    public void onJobMatched(EventEnvelope<Map<String, Object>> e, Acknowledgment ack) {
        try {
            Map<String, Object> p = e.payload();
            String title = (String) p.get("title");
            Object ids = p.get("studentIds");
            if (ids instanceof Collection<?> coll) {
                for (Object idObj : coll) {
                    UUID id = UUID.fromString(idObj.toString());
                    notifications.send(id, "NEW_JOB", "New job match for you: " + title);
                }
            }
        } catch (Exception ex) {
            log.warn("Error handling job.matched: {}", ex.getMessage());
        } finally {
            ack.acknowledge();
        }
    }

    @KafkaListener(topics = "application.status.changed", groupId = "notification-service")
    public void onStatus(EventEnvelope<Map<String, Object>> e, Acknowledgment ack) {
        try {
            Map<String, Object> p = e.payload();
            UUID studentId = UUID.fromString(p.get("studentId").toString());
            String status = (String) p.get("status");
            notifications.send(studentId, "APPLICATION", "Your application status is now: " + status);
        } catch (Exception ex) {
            log.warn("Error handling application.status.changed: {}", ex.getMessage());
        } finally {
            ack.acknowledge();
        }
    }

    @KafkaListener(topics = "notification.send", groupId = "notification-service")
    public void onDirectSend(EventEnvelope<Map<String, Object>> e, Acknowledgment ack) {
        try {
            Map<String, Object> p = e.payload();
            Object recipient = p.get("recipientId");
            if (recipient != null) {
                UUID recipientId = UUID.fromString(recipient.toString());
                String message = (String) p.getOrDefault("message", "New notification");
                String type = (String) p.getOrDefault("type", "ALERT");
                notifications.send(recipientId, type, message);
            }
        } catch (Exception ex) {
            log.warn("Error handling notification.send: {}", ex.getMessage());
        } finally {
            ack.acknowledge();
        }
    }
}
