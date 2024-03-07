package com.example.flowersproject.services.impl.auth;

import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.services.PasswordRecoveryService;
import com.example.flowersproject.services.util.EmailUtil;
import com.example.flowersproject.token.Token;
import com.example.flowersproject.token.TokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@AllArgsConstructor
public class PasswordRecoveryServiceImpl implements PasswordRecoveryService {

    private final TokenRepository tokenRepository;
    private final EmailUtil emailUtil;
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    public void initiatePasswordRecovery(UserEntity user) {
        String token = generateID();

        Token recoveryToken = new Token();
        recoveryToken.setToken(token);
        recoveryToken.setUserEntity(user);
        tokenRepository.save(recoveryToken);

        emailUtil.sendRecoveryEmail(user.getEmail(), token);

        executor.schedule(() -> tokenRepository.delete(recoveryToken), 15, TimeUnit.MINUTES);
    }

    private String generateID() {
        return UUID.randomUUID().toString();
    }

}
