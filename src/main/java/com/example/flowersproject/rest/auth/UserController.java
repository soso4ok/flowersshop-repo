package com.example.flowersproject.rest.auth;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserRole;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
