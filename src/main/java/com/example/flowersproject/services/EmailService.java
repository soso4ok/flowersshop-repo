package com.example.flowersproject.services;

public interface EmailService {
    void sendRecoveryEmail(String email, String token);

    void sendVerificationEmail(String to, String name, String link);
}
