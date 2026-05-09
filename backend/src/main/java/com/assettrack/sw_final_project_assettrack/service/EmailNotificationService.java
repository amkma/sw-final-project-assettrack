package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailNotificationService(
            JavaMailSender mailSender,
            @Value("${app.mail.from:no-reply@assettrack.local}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendNotificationEmail(User user, String subject, String message) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("Skipping email notification for user {} because no email address is available", user.getId());
            return;
        }

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromAddress);
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject(subject);
        mailMessage.setText(buildEmailBody(user, message));

        try {
            mailSender.send(mailMessage);
            log.info("Email notification sent to user {} at {}", user.getId(), user.getEmail());
        } catch (MailException ex) {
            log.error("Failed to send email notification to user {} at {}", user.getId(), user.getEmail(), ex);
        }
    }

    private String buildEmailBody(User user, String message) {
        String firstName = user.getFirstName() == null || user.getFirstName().isBlank()
                ? "there"
                : user.getFirstName();

        return "Hello " + firstName + ",\n\n"
                + message + "\n\n"
                + "This notification was sent from AssetTrack.";
    }
}
