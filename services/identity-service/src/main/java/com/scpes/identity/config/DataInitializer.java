package com.scpes.identity.config;

import com.scpes.identity.entity.Permission;
import com.scpes.identity.entity.Role;
import com.scpes.identity.entity.User;
import com.scpes.identity.entity.UserStatus;
import com.scpes.identity.repository.PermissionRepository;
import com.scpes.identity.repository.RoleRepository;
import com.scpes.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Identity database already initialized");
            return;
        }

        log.info("Initializing permissions, roles, and default presentation users...");

        // 1. Create Permissions
        List<String> permCodes = List.of(
                "DRIVE_CREATE",
                "RULE_MANAGE",
                "STUDENT_VERIFY",
                "USER_IMPORT",
                "COMPANY_APPROVE",
                "JOB_PUBLISH",
                "RESULT_MANAGE"
        );
        Map<String, Permission> permMap = new HashMap<>();
        for (String code : permCodes) {
            Permission p = permissionRepository.findByCode(code)
                    .orElseGet(() -> permissionRepository.save(new Permission(code)));
            permMap.put(code, p);
        }

        // 2. Create Roles
        Role adminRole = getOrCreateRole("ADMIN", Set.copyOf(permMap.values()));
        Role tpoRole = getOrCreateRole("TPO", Set.copyOf(permMap.values()));
        Role facultyRole = getOrCreateRole("FACULTY", Set.of(permMap.get("STUDENT_VERIFY")));
        Role recruiterRole = getOrCreateRole("RECRUITER", Set.of(permMap.get("JOB_PUBLISH")));
        Role studentRole = getOrCreateRole("STUDENT", Set.of());

        // 3. Seed Users
        createUser("ADM001", "admin@scpes.edu", "Admin@123", adminRole);
        createUser("TPO001", "tpo@scpes.edu", "Tpo@123", tpoRole);
        createUser("FAC001", "faculty@scpes.edu", "Faculty@123", facultyRole);
        createUser("REC001", "recruiter@google.com", "Recruiter@123", recruiterRole);

        // Pre-seeded students
        createUser("STU001", "student1@scpes.edu", "Student@123", studentRole);
        createUser("STU002", "student2@scpes.edu", "Student@123", studentRole);
        createUser("STU003", "student3@scpes.edu", "Student@123", studentRole);

        log.info("Identity initialization completed successfully!");
    }

    private Role getOrCreateRole(String name, Set<Permission> permissions) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role(name);
            role.setPermissions(permissions);
            return roleRepository.save(role);
        });
    }

    private void createUser(String code, String email, String password, Role role) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            User user = new User();
            user.setUserCode(code);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);
            log.info("Created user: {} ({}) with role {}", email, code, role.getName());
        }
    }
}
