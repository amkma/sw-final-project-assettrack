package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class LowStockScheduler {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 9 * * *")
    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Transactional
    public void checkLowStock() {
        log.info("Running low stock check...");

        List<Object[]> typeCounts = assetRepository.countByTypeAndStatus("AVAILABLE");
        List<User> admins = userRepository.findByRoleId(2L);
        List<User> managers = userRepository.findByRoleId(1L);

        for (Object[] row : typeCounts) {
            String type = (String) row[0];
            long count = ((Number) row[1]).longValue();

            if (count < 5) {
                String subject = "Low Stock Alert";
                String message = "Low stock alert: only " + count + " " + type + "(s) available.";

                for (User admin : admins) {
                    notificationService.createNotification(admin.getId(), subject, message);
                }
                for (User manager : managers) {
                    notificationService.createNotification(manager.getId(), subject, message);
                }
            }
        }

        log.info("Low stock check complete.");
    }
}
