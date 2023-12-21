package com.example.flowersproject.rest;

import com.example.flowersproject.dto.AuthenticationRequest;
import com.example.flowersproject.dto.AuthenticationResponse;
import com.example.flowersproject.dto.RegisterRequest;
import com.example.flowersproject.security.AuthenticationService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserServiceImpl userService;

    @GetMapping("/demo")
    public String getDemo() {
        return "working";
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userService.userAlreadyExists(request.getEmail())) {
            // User already exists, return 409 Conflict
            return new ResponseEntity<>("USER_EXISTS", HttpStatus.CONFLICT);
        }
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> login (@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticationResponse(request));
    }

}
