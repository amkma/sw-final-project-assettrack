package com.assettrack.sw_final_project_assettrack.dto.request;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetSearchRequest  {
    private String type;
    private String status;
    private String brand;
    private Long userId;
}
