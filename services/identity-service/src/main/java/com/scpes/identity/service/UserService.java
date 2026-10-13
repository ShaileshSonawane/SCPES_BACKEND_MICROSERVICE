package com.scpes.identity.service;

import com.scpes.common.error.BusinessException;
import com.scpes.identity.dto.UpdateUserStatusRequest;
import com.scpes.identity.dto.UserDto;
import com.scpes.identity.entity.User;
import com.scpes.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository users;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return users.findAll().stream().map(UserDto::from).toList();
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        return users.findById(id)
                .map(UserDto::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public UserDto updateStatus(UUID id, UpdateUserStatusRequest req) {
        User user = users.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(req.status());
        return UserDto.from(users.save(user));
    }
}
