package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.response.NotificationResponse;
import com.assettrack.sw_final_project_assettrack.entity.Notification;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.repository.NotificationRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import com.assettrack.sw_final_project_assettrack.mapper.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    /*
     * Get notifications with pageable
     */
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable)
                .map(notificationMapper::toResponse);
    }


    public long countUnreadNotifications(Long userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }

  
    @Transactional
    public NotificationResponse createNotification(Long userId,String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
        LocalDate now = LocalDate.now();
        Notification notification = Notification.builder()
                .user(user)
                .description(message)
                .isRead(false)
                .date(now)
                .build();

        notificationRepository.save(notification);

        return notificationMapper.toResponse(notification);
    }


    @Transactional
    public void markAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

}