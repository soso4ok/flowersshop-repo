package com.example.flowersproject.security;


import com.example.flowersproject.entity.UserEntity;
import com.example.flowersproject.exceptions.UnauthorizedExeption;
import com.example.flowersproject.repository.UserRepository;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationManager implements ReactiveAuthenticationManager {

    private UserRepository userRepository;

    public Mono<Authentication> authenticate(Authentication authentication) {
        CustomPrincipal principal = (CustomPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId())
                .filter(UserEntity::isEnabled)
                .switchIfEmpty(Mono.error(new UnauthorizedExeption("User disabled")))
                .map(user -> authentication);
        }


 }