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
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    public static final UUID ID_ADMIN = UUID.fromString("00000000-0000-0000-0000-000000000001");
    public static final UUID ID_TPO = UUID.fromString("00000000-0000-0000-0000-000000000002");
    public static final UUID ID_FACULTY = UUID.fromString("00000000-0000-0000-0000-000000000003");
    public static final UUID ID_RECRUITER = UUID.fromString("00000000-0000-0000-0000-000000000004");
    public static final UUID ID_STUDENT_1 = UUID.fromString("00000000-0000-0000-0000-000000000011");
    public static final UUID ID_STUDENT_2 = UUID.fromString("00000000-0000-0000-0000-000000000012");
    public static final UUID ID_STUDENT_3 = UUID.fromString("00000000-0000-0000-0000-000000000013");

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

        log.info("Initializing permissions, roles, and default presentation users with SCPE IDs...");

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
                    .orElseGet(() -> {
                        Permission newPerm = new Permission(code);
                        newPerm.setScpeId("SCPE-PRM-" + code);
                        return permissionRepository.save(newPerm);
                    });
            permMap.put(code, p);
        }

        // 2. Create Roles
        Role adminRole = getOrCreateRole("ADMIN", "SCPE-ROL-ADMIN", Set.copyOf(permMap.values()));
        Role tpoRole = getOrCreateRole("TPO", "SCPE-ROL-TPO", Set.copyOf(permMap.values()));
        Role facultyRole = getOrCreateRole("FACULTY", "SCPE-ROL-FACULTY", Set.of(permMap.get("STUDENT_VERIFY")));
        Role recruiterRole = getOrCreateRole("RECRUITER", "SCPE-ROL-RECRUITER", Set.of(permMap.get("JOB_PUBLISH")));
        Role studentRole = getOrCreateRole("STUDENT", "SCPE-ROL-STUDENT", Set.of());

        // 3. Seed Users with deterministic IDs and SCPE IDs
        createUser(ID_ADMIN, "ADM001", "SCPE-ADM-001", "admin@scpes.edu", "Admin@123", adminRole);
        createUser(ID_TPO, "TPO001", "SCPE-TPO-001", "tpo@scpes.edu", "Tpo@123", tpoRole);
        createUser(ID_FACULTY, "FAC001", "SCPE-FAC-001", "faculty@scpes.edu", "Faculty@123", facultyRole);
        createUser(ID_RECRUITER, "REC001", "SCPE-REC-001", "recruiter@google.com", "Recruiter@123", recruiterRole);

        // Pre-seeded students
        createUser(ID_STUDENT_1, "STU001", "SCPE-STU-001", "student1@scpes.edu", "Student@123", studentRole);
        createUser(ID_STUDENT_2, "STU002", "SCPE-STU-002", "student2@scpes.edu", "Student@123", studentRole);
        createUser(ID_STUDENT_3, "STU003", "SCPE-STU-003", "student3@scpes.edu", "Student@123", studentRole);

        log.info("Identity initialization completed successfully with SCPE IDs!");
    }

    private Role getOrCreateRole(String name, String scpeId, Set<Permission> permissions) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role(name);
            role.setScpeId(scpeId);
            role.setPermissions(permissions);
            return roleRepository.save(role);
        });
    }

    private void createUser(UUID id, String code, String scpeId, String email, String password, Role role) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            User user = new User();
            user.setId(id);
            user.setUserCode(code);
            user.setScpeId(scpeId);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);
            log.info("Created user: {} ({}, {}) with role {} and id {}", email, code, scpeId, role.getName(), id);
        }
    }
}
