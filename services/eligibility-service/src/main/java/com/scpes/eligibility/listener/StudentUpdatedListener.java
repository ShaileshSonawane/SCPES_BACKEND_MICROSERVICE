package com.scpes.eligibility.listener;

import com.scpes.common.event.EventEnvelope;
import com.scpes.eligibility.entity.ProcessedEventEntity;
import com.scpes.eligibility.repository.ProcessedEventRepository;
import com.scpes.eligibility.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class StudentUpdatedListener {
    private final EligibilityService service;
    private final ProcessedEventRepository processed;

    @KafkaListener(topics = "student.academic.updated", groupId = "eligibility-service")
    @Transactional
    public void on(EventEnvelope<Map<String, Object>> evt, Acknowledgment ack) {
        if (processed.existsById(evt.eventId())) {
            ack.acknowledge();
            return;
        }
        try {
            Object idVal = evt.payload().get("studentId");
            if (idVal != null) {
                UUID studentId = UUID.fromString(idVal.toString());
                service.reEvaluateStudentForOpenDrives(studentId);
            }
            processed.save(new ProcessedEventEntity(evt.eventId()));
        } catch (Exception e) {
            log.warn("Error processing student.academic.updated event: {}", e.getMessage());
        } finally {
            ack.acknowledge();
        }
    }
}
