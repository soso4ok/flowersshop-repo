package com.example.flowersproject;

import com.example.flowersproject.config.AdminProperties;
import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.entity.user.UserRole;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.services.UserService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import com.example.flowersproject.services.impl.auth.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@AllArgsConstructor
public class FlowersProjectApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;

	public static void main(String[] args) {
		SpringApplication.run(FlowersProjectApplication.class, args);
	}

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminProperties.getEmail()).isEmpty()) {
            userRepository.save(UserEntity.builder()
                    .firstname("admin")
                    .lastname("admin")
                    .email(adminProperties.getEmail())
                    .password(passwordEncoder.encode(adminProperties.getPassword()))
                    .role(UserRole.ADMIN)
                    .build());
        }
    }
}
