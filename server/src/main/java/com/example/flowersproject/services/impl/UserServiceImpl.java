package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.services.UserService;
import com.example.flowersproject.token.Token;
import com.example.flowersproject.token.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;

    @Override
    public boolean userAlreadyExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        Token recoveryToken = tokenRepository.findByToken(token)
                .orElseThrow();

        UserEntity user = recoveryToken.getUserEntity();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(recoveryToken);
    }

    @Override
    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }


}
