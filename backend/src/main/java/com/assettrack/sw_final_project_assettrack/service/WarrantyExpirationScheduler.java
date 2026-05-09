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

@Component
@RequiredArgsConstructor
@Slf4j
public class WarrantyExpirationScheduler {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 8 * * *")
    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Transactional
    public void checkWarrantyExpirations() {
        log.info("Running warranty expiration check...");

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);

        List<Asset> expiringSoon = assetRepository.findByWarrantyEndDateBetweenAndWarrantyNotifiedFalse(today, thirtyDaysFromNow);
        List<Asset> expired = assetRepository.findByWarrantyEndDateBeforeAndWarrantyNotifiedFalse(today);

        List<User> admins = userRepository.findByRoleId(2L);
        List<User> managers = userRepository.findByRoleId(1L);

        for (Asset asset : expiringSoon) {
            String subject = "Asset Warranty Expiring Soon";
            String message = "Warranty expiring soon: " + asset.getBrand() + " " + asset.getModel()
                    + " (SN: " + asset.getSn() + ") - expires on " + asset.getWarrantyEndDate();

            for (User admin : admins) {
                notificationService.createNotification(admin.getId(), subject, message);
            }
            for (User manager : managers) {
                notificationService.createNotification(manager.getId(), subject, message);
            }

            asset.setWarrantyNotified(true);
            assetRepository.save(asset);
        }

        for (Asset asset : expired) {
            String subject = "Asset Warranty Expired";
            String message = "Warranty expired: " + asset.getBrand() + " " + asset.getModel()
                    + " (SN: " + asset.getSn() + ") - expired on " + asset.getWarrantyEndDate();

            for (User admin : admins) {
                notificationService.createNotification(admin.getId(), subject, message);
            }
            for (User manager : managers) {
                notificationService.createNotification(manager.getId(), subject, message);
            }

            asset.setWarrantyNotified(true);
            asset.setStatus("EXPIRED");
            assetRepository.save(asset);
        }

        log.info("Warranty check complete. Expiring soon: {}, Already expired: {}",
                expiringSoon.size(), expired.size());
    }
}
