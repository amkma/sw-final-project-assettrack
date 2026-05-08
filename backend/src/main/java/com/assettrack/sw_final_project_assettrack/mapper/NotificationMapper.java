package com.assettrack.sw_final_project_assettrack.mapper;


import com.assettrack.sw_final_project_assettrack.dto.response.NotificationResponse;
import com.assettrack.sw_final_project_assettrack.entity.Notification;
import org.springframework.stereotype.Component;;

@Component
public class NotificationMapper {



    public NotificationResponse toResponse(Notification notification) {
        if (notification == null) return null;

        return NotificationResponse.builder()
                .id(notification.getId())
                .description(notification.getDescription())
                .date(notification.getDate())
                .isRead(notification.isRead())
                .build();
    }

    

}
