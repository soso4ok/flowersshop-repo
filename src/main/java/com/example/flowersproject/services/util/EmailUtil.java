package com.example.flowersproject.services.util;

import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class EmailUtil {

    private final JavaMailSender javaMailSender;

    public void sendRecoveryEmail(String email, String token) {
        SimpleMailMessage passwordResetEmail = new SimpleMailMessage();
        passwordResetEmail.setFrom("support@localhost");
        passwordResetEmail.setTo(email);
        passwordResetEmail.setSubject("Password Reset Request");
        passwordResetEmail.setText("Password available for 15 minutes \n" +
                "To reset your password, click the link below:\n" +
                                    "http://localhost:8083/api/v1/auth/reset?token=" + token);
        javaMailSender.send(passwordResetEmail);
    }

}
