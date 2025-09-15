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

    @Transactional
    public AuthenticationResponse register(UserDTO request) {

        if (userService.userAlreadyExists(request.getEmail())) {
            throw new AuthenticationException("User already exists", request.getEmail());
        }

        if (!new EmailValidator().isValid(request.getEmail(), null)) {
            throw new AuthenticationException("Invalid email format", request.getEmail());
        }

            var user = UserEntity.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(UserRole.USER)
                    .build();

            var savedUser = repository.save(user);
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);

            saveUserToken(savedUser, jwtToken);

            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();

    }

    @Transactional
    public AuthenticationResponse authenticationResponse(AuthenticationRequest request) {

            var userOptional = repository.findByEmail(request.getEmail());
            var user = userOptional.orElseThrow(() ->
                    new AuthenticationException("Invalid email or password", ""));

            if(userOptional.isPresent()) {

                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    throw new AuthenticationException("Invalid email or password for user: ", request.getEmail());
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
