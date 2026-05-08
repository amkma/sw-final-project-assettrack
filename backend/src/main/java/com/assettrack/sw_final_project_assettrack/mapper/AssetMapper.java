package com.assettrack.sw_final_project_assettrack.mapper;
import com.assettrack.sw_final_project_assettrack.dto.request.AssetRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AssetResponse;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AssetMapper {

    public Asset toEntity(AssetRequest request, User user) {
        return Asset.builder()
                .sn(request.getSn())
                .type(request.getType())
                .brand(request.getBrand())
                .model(request.getModel())
                .purchaseDate(request.getPurchaseDate())
                .warrantyEndDate(request.getWarrantyEndDate())
                .user(user)
                .build();
    }

    public AssetResponse toResponse(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .sn(asset.getSn())
                .type(asset.getType())
                .brand(asset.getBrand())
                .model(asset.getModel())
                .purchaseDate(asset.getPurchaseDate())
                .warrantyEndDate(asset.getWarrantyEndDate())
                .build();
    }
}