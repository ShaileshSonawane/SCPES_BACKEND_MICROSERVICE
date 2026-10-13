package com.scpes.notification.service;

public interface EmailSender {
    void sendAsync(String to, String subject, String body);
}
