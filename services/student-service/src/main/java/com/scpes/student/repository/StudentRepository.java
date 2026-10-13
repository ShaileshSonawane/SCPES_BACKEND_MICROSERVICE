package com.scpes.student.repository;

import com.scpes.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByUserId(UUID userId);
    Optional<Student> findByRollNo(String rollNo);
    List<Student> findByPassoutYearAndBranchIn(int passoutYear, Collection<String> branches);
}
