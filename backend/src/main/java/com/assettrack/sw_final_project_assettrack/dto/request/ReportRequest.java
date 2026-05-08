package com.assettrack.sw_final_project_assettrack.dto.request;
import lombok.*;
import java.time.LocalDate;
import jakarta.validation.constraints.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequest {
    @NotNull
    private long userId;
    @NotNull
    private long assetId;
    @NotBlank
    private String description;
}
