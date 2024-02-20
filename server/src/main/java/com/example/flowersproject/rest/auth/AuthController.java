package com.example.flowersproject.rest.auth;

import com.example.flowersproject.entity.dto.AuthenticationRequest;
import com.example.flowersproject.entity.dto.AuthenticationResponse;
import com.example.flowersproject.entity.dto.RegisterRequest;
import com.example.flowersproject.security.AuthenticationService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserServiceImpl userService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userService.userAlreadyExists(request.getEmail())) {
                // return 409 Conflict
                return new ResponseEntity<>("USER_EXISTS", HttpStatus.CONFLICT);
            }
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (DataIntegrityViolationException e) {
            // Specific database constraint violation
            return new ResponseEntity<>("Email address is already in use", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Other exceptions
            return new ResponseEntity<>("Unexpected error during registration/authentication", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> login (@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticationResponse(request));
    }

}
