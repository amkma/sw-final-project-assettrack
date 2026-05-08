package com.assettrack.sw_final_project_assettrack.dto.response;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryResponse {

    private Long id;

    private String note;

    private LocalDate assignedAt;
    
    private LocalDate returnedAt;
}
