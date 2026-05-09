package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduled task that runs daily to check for assets with
 * expired or soon-to-expire warranties and sends notifications
 * to all Admins (roleId=2) and Managers (roleId=1).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WarrantyExpirationScheduler {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Runs every day at 8:00 AM.
     * Checks for warranties that:
     *   - Have already expired (warrantyEndDate < today)
     *   - Will expire within the next 30 days
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void checkWarrantyExpirations() {
        log.info("Running warranty expiration check...");

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);

        // Get all assets whose warranty ends between today and 30 days from now (expiring soon)
        List<Asset> expiringSoon = assetRepository.findByWarrantyEndDateBetween(today, thirtyDaysFromNow);

        // Get all assets whose warranty has already expired (today or before)
        List<Asset> expired = assetRepository.findByWarrantyEndDateBefore(today);

        // Get all admins and managers to notify
        List<User> admins = userRepository.findByRoleId(2L);
        List<User> managers = userRepository.findByRoleId(1L);

        // Notify about expiring soon
        for (Asset asset : expiringSoon) {
            String message = "⚠️ Warranty expiring soon: " + asset.getBrand() + " " + asset.getModel()
                    + " (SN: " + asset.getSn() + ") — expires on " + asset.getWarrantyEndDate();

            for (User admin : admins) {
                notificationService.createNotification(admin.getId(), message);
            }
            for (User manager : managers) {
                notificationService.createNotification(manager.getId(), message);
            }
        }

        // Notify about already expired
        for (Asset asset : expired) {
            String message = "🔴 Warranty expired: " + asset.getBrand() + " " + asset.getModel()
                    + " (SN: " + asset.getSn() + ") — expired on " + asset.getWarrantyEndDate();

            for (User admin : admins) {
                notificationService.createNotification(admin.getId(), message);
            }
            for (User manager : managers) {
                notificationService.createNotification(manager.getId(), message);
            }
        }

        log.info("Warranty check complete. Expiring soon: {}, Already expired: {}",
                expiringSoon.size(), expired.size());
    }
}
