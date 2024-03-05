package com.example.flowersproject.services;

import com.example.flowersproject.entity.user.UserEntity;

import java.util.Optional;

public interface UserService {
    boolean userAlreadyExists(String email);

    void resetPassword(String token, String newPassword);

    UserEntity findByEmail(String email);

}
