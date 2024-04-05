package com.example.flowersproject.rest.auth;

import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.services.impl.auth.PasswordRecoveryServiceImpl;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@AllArgsConstructor
public class PasswordRecoveryController {

    private PasswordRecoveryServiceImpl passwordRecoveryService;
    private UserServiceImpl userService;

    @PostMapping("/initiate")
    public ResponseEntity<String> initiatePasswordRecovery(@RequestParam("email") String email) {
        UserEntity user = userService.findByEmail(email);
        if (user != null) {
            passwordRecoveryService.initiatePasswordRecovery(user);
            return ResponseEntity.ok("Password recovery initiated. Please check your email.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token,
                                                @RequestParam("newPassword") String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password reset successfully.");
    }

}
