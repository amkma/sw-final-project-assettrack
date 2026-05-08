package com.assettrack.sw_final_project_assettrack.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class HistoryRequest {
    
    @NotNull(message = "assetId is required")
    private long assetId;

    @NotNull(message = "from UserId is required")
    private long fromUserId;

    @NotNull(message = "to UserId is required")
    private long toUserId;

    @NotBlank(message = "Note is required")
    private String note;

    @NotNull(message = "Assigned date is required")
    private LocalDate assignedAt;
    

}
