package com.example.flowersproject.services;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Optional;

public interface UserService {
    boolean userAlreadyExists(String email);

    void resetPassword(String token, String newPassword);

    UserEntity findByEmail(String email);

    UserDTO getUserInfo(String token);

}
