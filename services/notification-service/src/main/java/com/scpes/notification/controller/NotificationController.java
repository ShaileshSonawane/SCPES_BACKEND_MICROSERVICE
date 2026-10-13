package com.scpes.notification.controller;

import com.scpes.notification.dto.NotificationSummaryResponse;
import com.scpes.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public NotificationSummaryResponse getMyNotifications() {
        return notificationService.getMyNotifications();
    }

    @PatchMapping("/{id}/read")
    public void markRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
    }
}
