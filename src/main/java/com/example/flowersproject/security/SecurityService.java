package com.example.flowersproject.security;

import com.example.flowersproject.entity.UserEntity;
import com.example.flowersproject.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.*;

@Component
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Integer expirationInSeconds;
    @Value("${jwt.issuer}")
    private String issuer;

    private TokenDetails generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>() {{
            put("role", user.getRole());
        }};
        return generateToken(claims, user.getId().toString());
    }

    private TokenDetails generateToken(Map<String, Object> claims, String subject) {
        Long expirationTimeInMillis = expirationInSeconds * 1000L;
        Date expirationDate = new Date(new Date().getTime() + expirationTimeInMillis);

        return generateToken(expirationDate, claims, subject);
    }

    private TokenDetails generateToken(Date expirationDate, Map<String, Object> claims, String subject) {
        Date createdDate = new Date();
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuer(issuer)
                .setSubject(subject)
                .setIssuedAt(createdDate)
                .setId(UUID.randomUUID().toString())
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, Base64.getEncoder().encodeToString(secret.getBytes()))
                .compact();

                return TokenDetails.builder()
                        .token(token)
                        .issuedAt(createdDate)
                        .expiresAt(expirationDate)
                        .build();
    }


    public Mono<TokenDetails> authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .flatMap(userEntity -> {
                    if (!userEntity.isEnabled()) {
                        return Mono.error(new RuntimeException(""));
                    }
                    if (passwordEncoder.matches(password, userEntity.getPassword())) {
                        return Mono.error(new RuntimeException(""));
                    }

                    return Mono.just(generateToken(userEntity).toBuilder()
                            .userId(userEntity.getId())
                            .build());
                })
                .switchIfEmpty(Mono.error(new RuntimeException("")));
    }

}
