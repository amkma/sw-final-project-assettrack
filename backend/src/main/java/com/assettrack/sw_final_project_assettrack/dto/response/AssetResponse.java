package com.assettrack.sw_final_project_assettrack.dto.response;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AssetResponse {
     private Long id;
     private String sn;
     private String type;
     private String brand;
     private String model;
     private LocalDate purchaseDate;
     private LocalDate warrantyEndDate;
     private String status;
     private String lastOwnerName;
}
