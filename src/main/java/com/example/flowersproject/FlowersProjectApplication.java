package com.example.flowersproject;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.entity.user.UserRole;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.services.UserService;
import com.example.flowersproject.services.impl.UserServiceImpl;
import com.example.flowersproject.services.impl.auth.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@AllArgsConstructor
public class FlowersProjectApplication  {

	public static void main(String[] args) {
		SpringApplication.run(FlowersProjectApplication.class, args);
	}


}
