package com.example.flowersproject.security;

import com.example.flowersproject.config.CustomLogoutHandler;
import com.example.flowersproject.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static com.example.flowersproject.entity.user.UserRole.ADMIN;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] WHITE_LIST_URL =
    {
            "/api/v1/auth/**",
            "slides/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/send-email"
    };

    private final JwtAuthFilter authFilter;
    private final AuthenticationProvider authenticationProvider;
    private final UserServiceImpl userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable);

        http.cors(withDefaults());

        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers(WHITE_LIST_URL)
                            .permitAll();
                    auth.requestMatchers(WHITE_LIST_URL)
                            .permitAll()
                            .requestMatchers("/api/v1/admin/**").hasRole(ADMIN.name())
                            .requestMatchers(GET, "/api/v1/products/**", "/api/v1/order/**", "/api/v1/blogs/**").permitAll()
                            .requestMatchers(GET, "/api/v1/users/**").permitAll()
                            .requestMatchers(DELETE, "/api/v1/order/**").hasRole(ADMIN.name())
                            .requestMatchers(POST, "/api/v1/products/**", "/api/v1/blogs/**", "/api/v1/products/bouquets/**").hasRole(ADMIN.name())
                            .requestMatchers(PUT, "/api/v1/products/**", "/api/v1/order/**", "/api/v1/blogs/**").hasRole(ADMIN.name())
                            .requestMatchers(DELETE, "/api/v1/products/**", "/api/v1/order/**", "/api/v1/blogs/**").hasRole(ADMIN.name())
                            .anyRequest()
                            .authenticated();
        }).sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(
                        e->e.accessDeniedHandler((request, response, accessDeniedException)->response.setStatus(403))
                                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

        return http.build();
    }

    @Bean
    public LogoutHandler logoutHandler() {
        return new CustomLogoutHandler();
    }

}
