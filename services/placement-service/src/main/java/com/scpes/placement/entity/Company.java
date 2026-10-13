package com.scpes.placement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
public class Company {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String name;

    private String sector;

    private String website;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Company(String name, String sector, String website, String description) {
        this.name = name;
        this.sector = sector;
        this.website = website;
        this.description = description;
    }
}
