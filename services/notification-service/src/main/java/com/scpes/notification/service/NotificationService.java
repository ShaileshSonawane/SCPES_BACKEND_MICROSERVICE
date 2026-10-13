package com.scpes.notification.service;

import com.scpes.common.error.BusinessException;
import com.scpes.common.security.SecurityUtils;
import com.scpes.notification.dto.NotificationDto;
import com.scpes.notification.dto.NotificationSummaryResponse;
import com.scpes.notification.entity.Notification;
import com.scpes.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository repo;
    private final EmailSender emailSender;

    @Transactional
    public void send(UUID recipientId, String type, String message) {
        Notification notification = new Notification(recipientId, type, message);
        repo.save(notification);
        log.info("Saved in-app notification for user {}: {}", recipientId, type);

        // Async dispatch
        emailSender.sendAsync(recipientId + "@scpes.edu", "SCPES: " + type, message);
    }

    @Transactional(readOnly = true)
    public NotificationSummaryResponse getMyNotifications() {
        UUID userId = SecurityUtils.currentUserId();
        List<NotificationDto> list = repo.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDto::from)
                .toList();
        long unread = repo.countByRecipientIdAndIsReadFalse(userId);
        return new NotificationSummaryResponse(unread, list);
    }

    @Transactional
    public void markAsRead(UUID id) {
        Notification n = repo.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Notification not found"));
        n.setRead(true);
        repo.save(n);
    }
}
