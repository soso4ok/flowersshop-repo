package com.example.flowersproject.rest.auth;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.product.ProductEntity;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.entity.user.UserRole;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUserInfo(@RequestHeader("Authorization") String token) {
        UserDTO userDTO = userService.getUserInfo(token);
        if (userDTO != null) {
            return ResponseEntity.ok(userDTO);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    public static class UpdateUserRoleRequest {
        public String email;
        public UserRole role;
    }

    @PutMapping("/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRole(@RequestBody UpdateUserRoleRequest request) {
        userService.updateUserRole(request.email, request.role);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserEntity user,
            @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(user.getEmail(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Favorites ─────────────────────────────────────────

    @GetMapping("/favorites")
    public ResponseEntity<Set<ProductEntity>> getFavorites(@AuthenticationPrincipal UserEntity user) {
        Set<ProductEntity> favorites = userService.getFavorites(user.getId());
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/favorites/ids")
    public ResponseEntity<Set<Long>> getFavoriteIds(@AuthenticationPrincipal UserEntity user) {
        Set<Long> ids = userService.getFavoriteIds(user.getId());
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/favorites/{productId}")
    public ResponseEntity<?> addFavorite(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable Long productId) {
        try {
            userService.addFavorite(user.getId(), productId);
            return ResponseEntity.ok(Map.of("message", "Added to favorites"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/favorites/{productId}")
    public ResponseEntity<?> removeFavorite(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable Long productId) {
        userService.removeFavorite(user.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }
}
