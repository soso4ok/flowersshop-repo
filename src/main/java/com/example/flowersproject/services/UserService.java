package com.example.flowersproject.services;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserRole;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    boolean userAlreadyExists(String email);

    void resetPassword(String token, String newPassword);

    UserDetails loadUserByUsername(String email);

    UserDTO getUserInfo(String token);

    void updateUserRole(String email, UserRole newRole);
}
