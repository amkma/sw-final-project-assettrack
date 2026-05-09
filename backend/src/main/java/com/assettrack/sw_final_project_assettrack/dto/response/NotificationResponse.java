package com.assettrack.sw_final_project_assettrack.dto.response;
import lombok.*;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    
    private String description;

    private LocalDate date;

    @JsonProperty("isRead")
    private boolean isRead;

    
}
