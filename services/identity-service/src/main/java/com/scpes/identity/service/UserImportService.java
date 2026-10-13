package com.scpes.identity.service;

import com.scpes.identity.dto.ImportReport;
import com.scpes.identity.entity.Role;
import com.scpes.identity.entity.User;
import com.scpes.identity.entity.UserStatus;
import com.scpes.identity.repository.RoleRepository;
import com.scpes.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserImportService {
    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder encoder;

    @PreAuthorize("hasAuthority('USER_IMPORT') or hasRole('ADMIN')")
    @Transactional
    public ImportReport importStudents(MultipartFile csv) throws IOException {
        Role studentRole = roles.findByName("STUDENT").orElseThrow();
        int ok = 0;
        List<String> errors = new ArrayList<>();

        try (var reader = new BufferedReader(new InputStreamReader(csv.getInputStream()))) {
            String line;
            int lineNum = 0;
            while ((line = reader.readLine()) != null) {
                lineNum++;
                if (lineNum == 1) continue; // skip header (email,userCode,password)
                String[] parts = line.split(",");
                if (parts.length < 2) {
                    errors.add("Line " + lineNum + ": Invalid columns count");
                    continue;
                }
                String email = parts[0].trim();
                String userCode = parts[1].trim();
                String rawPassword = parts.length > 2 ? parts[2].trim() : "Student@123";

                if (users.existsByEmailIgnoreCase(email) || users.existsByUserCodeIgnoreCase(userCode)) {
                    errors.add("Line " + lineNum + ": User " + email + " or code " + userCode + " already exists");
                    continue;
                }

                User user = new User();
                user.setEmail(email);
                user.setUserCode(userCode);
                user.setPasswordHash(encoder.encode(rawPassword));
                user.setRole(studentRole);
                user.setStatus(UserStatus.ACTIVE);
                users.save(user);
                ok++;
            }
        }
        return new ImportReport(ok, errors);
    }
}
