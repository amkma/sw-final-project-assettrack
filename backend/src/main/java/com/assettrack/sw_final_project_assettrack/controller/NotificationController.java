package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.response.NotificationResponse;
import com.assettrack.sw_final_project_assettrack.service.NotificationService;
import com.assettrack.sw_final_project_assettrack.service.WarrantyExpirationScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final WarrantyExpirationScheduler warrantyExpirationScheduler;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, pageable));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.countUnreadNotifications(userId));
    }

    @PutMapping("/user/{userId}/read")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAsRead(userId);
        return ResponseEntity.noContent().build();
    }
    
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/user/{userId}")
    public ResponseEntity<NotificationResponse> createNotification(
            @PathVariable Long userId,
            @RequestBody String message) {
        return ResponseEntity.ok(notificationService.createNotification(userId, message));
    }

}
