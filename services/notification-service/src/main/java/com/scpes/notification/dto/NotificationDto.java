package com.scpes.notification.dto;

import com.scpes.notification.entity.Notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationDto(
        UUID id,
        UUID recipientId,
        String type,
        String message,
        boolean isRead,
        Instant createdAt
) {
    public static NotificationDto from(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getRecipientId(),
                n.getType(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
