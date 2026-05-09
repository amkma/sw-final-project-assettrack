package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.response.NotificationResponse;
import com.assettrack.sw_final_project_assettrack.entity.Notification;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.NotificationMapper;
import com.assettrack.sw_final_project_assettrack.repository.NotificationRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private static final String DEFAULT_SUBJECT = "AssetTrack Notification";

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final EmailNotificationService emailNotificationService;

    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByDateDescIdDesc(userId, pageable)
                .map(notificationMapper::toResponse);
    }

    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationResponse createNotification(Long userId, String message) {
        return createNotification(userId, DEFAULT_SUBJECT, message);
    }

    @Transactional
    public NotificationResponse createNotification(Long userId, String subject, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .description(message)
                .isRead(false)
                .date(LocalDate.now())
                .build();

        notificationRepository.save(notification);
        emailNotificationService.sendNotificationEmail(user, subject, message);

        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public void markAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Transactional
    public void markNotificationAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    @Transactional
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
