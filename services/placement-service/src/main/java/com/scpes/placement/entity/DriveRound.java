package com.scpes.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "drive_rounds")
@Getter
@Setter
@NoArgsConstructor
public class DriveRound {
    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private Drive drive;

    @Column(name = "round_no", nullable = false)
    private int roundNo;

    @Column(nullable = false)
    private String type; // Aptitude, Technical, HR

    private LocalDate date;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public DriveRound(Drive drive, int roundNo, String type, LocalDate date) {
        this.drive = drive;
        this.roundNo = roundNo;
        this.type = type;
        this.date = date;
    }
}
