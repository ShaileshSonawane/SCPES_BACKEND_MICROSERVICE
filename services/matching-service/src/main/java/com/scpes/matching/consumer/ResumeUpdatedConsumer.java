package com.scpes.matching.consumer;

import com.scpes.common.event.EventEnvelope;
import com.scpes.matching.service.ResumeParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResumeUpdatedConsumer {
    private final ResumeParserService parserService;

    @KafkaListener(topics = "resume.updated", groupId = "matching-service")
    public void onResumeUpdated(EventEnvelope<Map<String, Object>> event, Acknowledgment ack) {
        try {
            Map<String, Object> payload = event.payload();
            if (payload != null && payload.containsKey("studentId") && payload.containsKey("fileUrl")) {
                UUID studentId = UUID.fromString(payload.get("studentId").toString());
                String fileUrl = payload.get("fileUrl").toString();
                log.info("Received resume.updated event for student {} at path {}", studentId, fileUrl);
                parserService.parseFromPath(studentId, fileUrl);
                log.info("Successfully parsed and stored resume skills for student {}", studentId);
            }
        } catch (Exception e) {
            log.error("Failed to parse resume from Kafka event: {}", e.getMessage(), e);
        } finally {
            if (ack != null) {
                ack.acknowledge();
            }
        }
    }
}
