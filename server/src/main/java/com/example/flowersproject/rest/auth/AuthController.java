package com.example.flowersproject.rest.auth;

import com.example.flowersproject.dto.AuthenticationRequest;
import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.services.impl.auth.AuthenticationService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserServiceImpl userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO request) {
        try {
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Email address is already in use", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error during registration/authentication", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> login (@RequestBody AuthenticationRequest request) {
        try {
            var response = authenticationService.authenticationResponse(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
