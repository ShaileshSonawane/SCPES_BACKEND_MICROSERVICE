package com.scpes.identity.repository;

import com.scpes.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByUserCodeIgnoreCase(String userCode);
    Optional<User> findByScpeIdIgnoreCase(String scpeId);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUserCodeIgnoreCase(String userCode);
    boolean existsByScpeIdIgnoreCase(String scpeId);
}
