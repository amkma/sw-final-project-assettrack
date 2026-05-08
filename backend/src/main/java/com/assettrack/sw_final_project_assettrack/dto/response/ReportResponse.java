package com.assettrack.sw_final_project_assettrack.dto.response;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ReportResponse {
    private Long id;
    private String description;
    private LocalDate date;
    private String status;
}
