package com.scpes.notification.dto;

import java.util.List;

public record NotificationSummaryResponse(
        long unreadCount,
        List<NotificationDto> notifications
) {}
