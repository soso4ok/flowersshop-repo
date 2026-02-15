package com.example.flowersproject.services.impl;

import com.example.flowersproject.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {

    private JavaMailSender javaMailSender;

    @Override
    public void sendRecoveryEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Recovery");
        message.setText("Click the link to reset your password: http://example.com/reset-password?token=" + token);
        javaMailSender.send(message);
    }

    @Override
    public void sendVerificationEmail(String to, String name, String link) {
        System.out.println("========== EMAIL SERVICE DEBUG ==========");
        System.out.println("EmailService: Preparing to send email to " + to);
        System.out.println("Recipient name: " + name);
        System.out.println("Verification link: " + link);

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setText(buildEmailHtml(name, link), true);
            helper.setTo(to);
            helper.setSubject("Verify your Floralia account");
            helper.setFrom("nxdgbccvbnnnn@gmail.com");

            System.out.println("Email message prepared, attempting to send...");
            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
            System.out.println("========== EMAIL SENT ==========");
        } catch (MessagingException e) {
            System.out.println("ERROR: MessagingException while sending email:");
            e.printStackTrace();
            throw new IllegalStateException("Failed to send email", e);
        } catch (Exception e) {
            System.out.println("ERROR: Unexpected exception while sending email:");
            System.out.println("Exception type: " + e.getClass().getName());
            System.out.println("Exception message: " + e.getMessage());
            e.printStackTrace();
            throw new IllegalStateException("Failed to send email", e);
        }
    }

    private String buildEmailHtml(String name, String link) {
        return "<div style=\"font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background-color: #F9F8F4; padding: 40px; color: #2C3E2E;\">\n"
                +
                "    <h1 style=\"font-size: 32px; letter-spacing: -0.02em; margin-bottom: 24px;\">Floralia</h1>\n" +
                "    <p style=\"font-size: 16px; line-height: 1.6; margin-bottom: 24px;\">Dear " + name + ",</p>\n" +
                "    <p style=\"font-size: 16px; line-height: 1.6; margin-bottom: 24px;\">\n" +
                "        Welcome to Floralia. To complete your registration and begin your journey with us, please verify your email address.\n"
                +
                "    </p>\n" +
                "    <div style=\"text-align: center; margin: 40px 0;\">\n" +
                "        <a href=\"" + link
                + "\" style=\"display: inline-block; background-color: #2C3E2E; color: #F9F8F4; text-decoration: none; padding: 14px 32px; font-family: sans-serif; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;\">Verify Account</a>\n"
                +
                "    </div>\n" +
                "    <p style=\"font-size: 14px; color: rgba(44, 62, 46, 0.6); margin-top: 40px; border-top: 1px solid rgba(44, 62, 46, 0.1); padding-top: 20px;\">\n"
                +
                "        Link expires in 24 hours. If you did not create an account, please ignore this email.\n" +
                "    </p>\n" +
                "</div>";
    }
}
