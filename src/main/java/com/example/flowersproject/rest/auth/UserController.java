package com.example.flowersproject.rest.auth;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.services.UserService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
