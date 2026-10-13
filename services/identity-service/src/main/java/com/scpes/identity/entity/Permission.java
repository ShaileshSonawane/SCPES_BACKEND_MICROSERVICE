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

    @Column(unique = true, nullable = false)
    private String code;

    public Permission(String code) {
        this.code = code;
    }
}
