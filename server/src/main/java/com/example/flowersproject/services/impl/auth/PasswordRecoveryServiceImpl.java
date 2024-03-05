package com.example.flowersproject.services.impl.auth;

import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.services.PasswordRecoveryService;
import com.example.flowersproject.services.impl.util.EmailUtil;
import com.example.flowersproject.token.Token;
import com.example.flowersproject.token.TokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class PasswordRecoveryServiceImpl implements PasswordRecoveryService {

    private final TokenRepository tokenRepository;
    private final EmailUtil emailUtil;

    public void initiatePasswordRecovery(UserEntity user) {
        String token = generateID();

        Token recoveryToken = new Token();
        recoveryToken.setToken(token);
        recoveryToken.setUserEntity(user);
        tokenRepository.save(recoveryToken);

        emailUtil.sendRecoveryEmail(user.getEmail(), token);
    }

    private String generateID() {
        return UUID.randomUUID().toString();
    }

}
