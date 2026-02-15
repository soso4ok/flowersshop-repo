package com.example.flowersproject.services;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.product.ProductEntity;
import com.example.flowersproject.entity.user.UserRole;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Set;

public interface UserService {
    boolean userAlreadyExists(String email);

    void resetPassword(String token, String newPassword);

    UserDetails loadUserByUsername(String email);

    UserDTO getUserInfo(String token);

    void updateUserRole(String email, UserRole newRole);

    void changePassword(String email, String oldPassword, String newPassword);

    Set<ProductEntity> getFavorites(Integer userId);

    void addFavorite(Integer userId, Long productId);

    void removeFavorite(Integer userId, Long productId);

    Set<Long> getFavoriteIds(Integer userId);
}
