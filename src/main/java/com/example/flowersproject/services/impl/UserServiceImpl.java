package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.security.JwtService;
import com.example.flowersproject.services.UserService;
import com.example.flowersproject.services.mappers.UserMapper;
import com.example.flowersproject.token.Token;
import com.example.flowersproject.token.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

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

    public UserDTO getUserInfo(String token) {
        String jwtToken = token.substring(7);
        String email = jwtService.extractUseremail(jwtToken);

        if (email != null) {
            UserEntity userEntity = (UserEntity) loadUserByUsername(email);
            if (userEntity != null) {
                logger.info("ahahahahahahah", userEntity);
                return userMapper.userEntityToDto(userEntity);
            }
        }
        return null;
    }

    boolean userHasPermissionToDoRequest() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }
}
