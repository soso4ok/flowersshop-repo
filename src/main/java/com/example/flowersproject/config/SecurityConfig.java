package com.example.flowersproject.config;

import com.example.flowersproject.security.AuthenticationManager;
import com.example.flowersproject.security.BearerTokenServerAuthenticationConverter;
import com.example.flowersproject.security.JwtHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Value("{$jwt.secret}")
    private String secret;

    private final String[] publicRoutes = {"/api/v1/auth/register", "/api/v1/auth/login"};

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, AuthenticationManager authenticationManager) {

        http.csrf(e -> e.disable());

        http.authorizeExchange(auth -> {
                    auth.pathMatchers(HttpMethod.OPTIONS)
                            .permitAll()
                            .pathMatchers(publicRoutes)
                            .permitAll()
                            .anyExchange()
                            .authenticated();
                });

        http.exceptionHandling(exeptions -> exeptions
                .authenticationEntryPoint((swe, e) -> {
                    log.error("In securityWebFilterChain - unauthorized error: {}", e.getMessage());
                    return Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED));
                })
                .accessDeniedHandler((swe, e) -> {
                    log.error("In securityWebFilterChain - access denied: {}", e.getMessage());
                    return Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN));
                }));



        http.addFilterAt(bearerAuthenticationFilter(authenticationManager), SecurityWebFiltersOrder.AUTHENTICATION);

        return http.build();
    }

//    @Bean
//    public ServerHttpSecurity serverHttpSecurity() {
//        return ServerHttpSecurity.http();
//    }



    private AuthenticationWebFilter bearerAuthenticationFilter(AuthenticationManager authenticationManager) {

         AuthenticationWebFilter bearerAuthenticationFilter = new AuthenticationWebFilter(authenticationManager);
         bearerAuthenticationFilter.setServerAuthenticationConverter(new BearerTokenServerAuthenticationConverter(new JwtHandler(secret)));
         bearerAuthenticationFilter.setRequiresAuthenticationMatcher(ServerWebExchangeMatchers.pathMatchers("/**"));

         return bearerAuthenticationFilter;
     }

}
