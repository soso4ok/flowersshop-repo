package com.example.flowersproject.services.impl.auth;

import com.example.flowersproject.dto.AuthenticationRequest;
import com.example.flowersproject.dto.AuthenticationResponse;
import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.entity.user.UserRole;
import com.example.flowersproject.exceptions.AuthenticationException;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.security.JwtService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import com.example.flowersproject.services.ConfirmationTokenService;
import com.example.flowersproject.services.EmailService;
import com.example.flowersproject.token.Token;
import com.example.flowersproject.token.TokenRepository;
import com.example.flowersproject.token.TokenType;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.internal.constraintvalidators.bv.EmailValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final JwtService jwtService;
    private final UserServiceImpl userService;
    private final TokenRepository tokenRepository;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;

    @Transactional
    public String register(UserDTO request) {

        if (userService.userAlreadyExists(request.getEmail())) {
            System.out.println("ERROR: User already exists with email: " + request.getEmail());
            throw new AuthenticationException("User already exists", request.getEmail());
        }

        System.out.println("Email not found in DB - proceeding with registration");

        if (!new EmailValidator().isValid(request.getEmail(), null)) {
            System.out.println("ERROR: Invalid email format: " + request.getEmail());
            throw new AuthenticationException("Invalid email format", request.getEmail());
        }

        System.out.println("Email format valid - creating user entity");

        var user = UserEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .enabled(false)
                .build();

        var savedUser = repository.save(user);
        System.out.println("User saved successfully with ID: " + savedUser.getId());

        // Generate confirmation token
        String token = java.util.UUID.randomUUID().toString();
        System.out.println("Generated confirmation token: " + token);

        com.example.flowersproject.entity.ConfirmationToken confirmationToken = new com.example.flowersproject.entity.ConfirmationToken(
                token,
                java.time.LocalDateTime.now(),
                java.time.LocalDateTime.now().plusHours(24),
                savedUser);
        confirmationTokenService.saveConfirmationToken(confirmationToken);
        System.out.println("Confirmation token saved to database");

        // Send verification email
        String link = "https://floralia.studio/verify-email?token=" + token;
        System.out.println("User saved. Attempting to send verification email...");
        System.out.println("Verification link: " + link);

        try {
            emailService.sendVerificationEmail(
                    request.getEmail(),
                    request.getFirstname(),
                    link);
            System.out.println("Verification email sent successfully!");
        } catch (Exception e) {
            System.out.println("ERROR sending verification email:");
            e.printStackTrace();
            // Don't fail registration if email fails - user can request resend
        }

        System.out.println("========== REGISTRATION COMPLETE ==========");

        return "Please check your email to verify your account";
    }

    @Transactional
    public AuthenticationResponse confirmToken(String token) {
        com.example.flowersproject.entity.ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() -> new AuthenticationException("Token not found", ""));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new AuthenticationException("Email already confirmed", "");
        }

        if (confirmationToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new AuthenticationException("Token expired", "");
        }

        confirmationTokenService.setConfirmedAt(token);

        UserEntity user = confirmationToken.getUser();
        user.setEnabled(true);
        repository.save(user);

        // Generate and return JWT for auto-login
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public AuthenticationResponse authenticationResponse(AuthenticationRequest request) {

        var userOptional = repository.findByEmail(request.getEmail());
        var user = userOptional.orElseThrow(() -> new AuthenticationException("Invalid email or password", ""));

        if (userOptional.isPresent()) {

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new AuthenticationException("Invalid email or password for user: ", request.getEmail());
            }

            if (!user.isEnabled()) {
                throw new AuthenticationException("Please verify your email first", request.getEmail());
            }

            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        }
        throw new RuntimeException("Internal server error");
    }

    @Transactional
    public AuthenticationResponse refreshToken(String refreshToken) throws AuthenticationException {
        Token existingToken = findByTokenAndValid(refreshToken)
                .orElseThrow(() -> new AuthenticationException("Invalid or expired refresh token", ""));

        UserEntity user = existingToken.getUserEntity();

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        existingToken.setToken(newAccessToken);
        if (newRefreshToken != null) {
            existingToken.setToken(newRefreshToken);
        }
        tokenRepository.save(existingToken);

        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    public void logout(String refreshToken) throws AuthenticationException {
        Token token = findByTokenAndValid(refreshToken)
                .orElseThrow(() -> new AuthenticationException("Invalid or expired refresh token", ""));

        token.setExpired(true);
        tokenRepository.save(token);
    }

    Optional<Token> findByTokenAndValid(String refreshToken) {
        return tokenRepository.findByToken(refreshToken)
                .filter(token -> !token.isExpired() && !token.isRevoked());
    }

    private void revokeAllUserTokens(UserEntity user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(UserEntity userEntity, String jwtToken) {
        var token = Token.builder()
                .userEntity(userEntity)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
}
