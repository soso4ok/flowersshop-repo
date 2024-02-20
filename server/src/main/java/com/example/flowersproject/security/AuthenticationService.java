package com.example.flowersproject.security;

import com.example.flowersproject.entity.dto.AuthenticationRequest;
import com.example.flowersproject.entity.dto.AuthenticationResponse;
import com.example.flowersproject.entity.dto.RegisterRequest;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.security.exceptions.AuthenticationException;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.token.Token;
import com.example.flowersproject.token.TokenRepository;
import com.example.flowersproject.token.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {

            var user = UserEntity.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
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

        try {
            var user = repository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AuthenticationException("Invalid email or password", "INVALID"));
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);

            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (AuthenticationException e) {
            throw e;
        }
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
