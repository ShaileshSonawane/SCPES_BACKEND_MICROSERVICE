package com.scpes.identity.controller;

import com.scpes.identity.dto.ImportReport;
import com.scpes.identity.dto.UpdateUserStatusRequest;
import com.scpes.identity.dto.UserDto;
import com.scpes.identity.service.UserImportService;
import com.scpes.identity.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserImportService userImportService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> list() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TPO')")
    public UserDto getById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateUserStatusRequest req) {
        return userService.updateStatus(id, req);
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('USER_IMPORT')")
    public ImportReport importUsers(@RequestParam("file") MultipartFile file) throws IOException {
        return userImportService.importStudents(file);
    }
}
