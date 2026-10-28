package com.scpes.student.config;

import com.scpes.student.entity.AcademicRecord;
import com.scpes.student.entity.Student;
import com.scpes.student.entity.VerificationStatus;
import com.scpes.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    public static final UUID ID_STUDENT_1 = UUID.fromString("00000000-0000-0000-0000-000000000011");
    public static final UUID ID_STUDENT_2 = UUID.fromString("00000000-0000-0000-0000-000000000012");
    public static final UUID ID_STUDENT_3 = UUID.fromString("00000000-0000-0000-0000-000000000013");

    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (studentRepository.count() > 0) {
            log.info("Student records already initialized");
            return;
        }

        log.info("Initializing sample student records with SCPE IDs for presentation demo...");

        // Student 1: Aarav Sharma (Eligible for high-cut-off jobs)
        Student s1 = new Student();
        s1.setId(ID_STUDENT_1);
        s1.setUserId(ID_STUDENT_1);
        s1.setScpeId("SCPE-STU-001");
        s1.setName("Aarav Sharma");
        s1.setRollNo("STU001");
        s1.setBranch("CSE");
        s1.setBatch("2023-2027");
        s1.setPassoutYear(2027);
        s1.setPhone("+91 9876543210");
        s1.setSkills(Set.of("Java", "Spring Boot", "SQL", "Docker"));

        AcademicRecord a1 = new AcademicRecord();
        a1.setStudent(s1);
        a1.setStudentId(s1.getId());
        a1.setScpeId("SCPE-ACR-001");
        a1.setTenthPct(BigDecimal.valueOf(89.0));
        a1.setTwelfthPct(BigDecimal.valueOf(86.5));
        a1.setCgpa(BigDecimal.valueOf(8.50));
        a1.setActiveBacklogs(0);
        a1.setBacklogHistory(0);
        a1.setGapYears(0);
        a1.setVerificationStatus(VerificationStatus.VERIFIED);
        s1.setAcademicRecord(a1);
        studentRepository.save(s1);

        // Student 2: Neha Patel (Has 1 backlog, CGPA 6.50 -> demonstrates rule failure reasons!)
        Student s2 = new Student();
        s2.setId(ID_STUDENT_2);
        s2.setUserId(ID_STUDENT_2);
        s2.setScpeId("SCPE-STU-002");
        s2.setName("Neha Patel");
        s2.setRollNo("STU002");
        s2.setBranch("IT");
        s2.setBatch("2023-2027");
        s2.setPassoutYear(2027);
        s2.setPhone("+91 9876543211");
        s2.setSkills(Set.of("Python", "SQL"));

        AcademicRecord a2 = new AcademicRecord();
        a2.setStudent(s2);
        a2.setStudentId(s2.getId());
        a2.setScpeId("SCPE-ACR-002");
        a2.setTenthPct(BigDecimal.valueOf(72.0));
        a2.setTwelfthPct(BigDecimal.valueOf(70.0));
        a2.setCgpa(BigDecimal.valueOf(6.50));
        a2.setActiveBacklogs(1);
        a2.setBacklogHistory(1);
        a2.setGapYears(0);
        a2.setVerificationStatus(VerificationStatus.VERIFIED);
        s2.setAcademicRecord(a2);
        studentRepository.save(s2);

        // Student 3: Rohan Verma (ECE branch, unverified SUBMITTED state)
        Student s3 = new Student();
        s3.setId(ID_STUDENT_3);
        s3.setUserId(ID_STUDENT_3);
        s3.setScpeId("SCPE-STU-003");
        s3.setName("Rohan Verma");
        s3.setRollNo("STU003");
        s3.setBranch("ECE");
        s3.setBatch("2023-2027");
        s3.setPassoutYear(2027);
        s3.setPhone("+91 9876543212");
        s3.setSkills(Set.of("C++", "Embedded C"));

        AcademicRecord a3 = new AcademicRecord();
        a3.setStudent(s3);
        a3.setStudentId(s3.getId());
        a3.setScpeId("SCPE-ACR-003");
        a3.setTenthPct(BigDecimal.valueOf(80.0));
        a3.setTwelfthPct(BigDecimal.valueOf(78.0));
        a3.setCgpa(BigDecimal.valueOf(7.20));
        a3.setActiveBacklogs(0);
        a3.setBacklogHistory(0);
        a3.setGapYears(1);
        a3.setVerificationStatus(VerificationStatus.SUBMITTED);
        s3.setAcademicRecord(a3);
        studentRepository.save(s3);

        log.info("Sample students successfully initialized with deterministic SCPE IDs!");
    }
}
