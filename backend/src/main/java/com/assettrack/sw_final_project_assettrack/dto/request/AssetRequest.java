package com.assettrack.sw_final_project_assettrack.dto.request;
import lombok.*;
import java.time.LocalDate;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetRequest {
    @NotBlank
     private String sn;
    @NotBlank
     private String type;
    @NotBlank
     private String brand;
    @NotBlank
     private String model;
    @NotNull
     private LocalDate purchaseDate;
    @NotNull
     private LocalDate warrantyEndDate;
}
