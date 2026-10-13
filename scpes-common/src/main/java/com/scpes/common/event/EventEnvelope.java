package com.scpes.common.event;

import org.slf4j.MDC;

import java.time.Instant;
import java.util.UUID;

public record EventEnvelope<T>(
        UUID eventId,
        String type,
        Instant occurredAt,
        String correlationId,
        T payload
) {
    public static <T> EventEnvelope<T> of(String type, T payload) {
        return new EventEnvelope<>(
                UUID.randomUUID(),
                type,
                Instant.now(),
                MDC.get("correlationId"),
                payload
        );
    }
}
