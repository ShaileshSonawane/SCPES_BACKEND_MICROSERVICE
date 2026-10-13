package com.scpes.student.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
public class Student {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "roll_no", nullable = false, unique = true)
    private String rollNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String branch;

    private String batch;

    @Column(name = "passout_year", nullable = false)
    private int passoutYear;

    private String phone;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private AcademicRecord academicRecord;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
}
