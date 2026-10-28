package com.scpes.identity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
public class Permission {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "scpe_id", length = 64)
    private String scpeId;

    @Column(unique = true, nullable = false)
    private String code;

    public Permission(String code) {
        this.code = code;
    }

    @PrePersist
    public void ensureScpeId() {
        if (this.scpeId == null || this.scpeId.isBlank()) {
            this.scpeId = "SCPE-PRM-" + (code != null ? code.toUpperCase() : UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
    }
}
