package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.request.AssetRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AssetResponse;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.AssetMapper;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssetMapper assetMapper;

    public AssetResponse createAsset(AssetRequest request) {

        if (assetRepository.existsBySn(request.getSn())) {
            throw new RuntimeException("Serial number already exists");
        }

        User user = null;

        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Asset asset = assetMapper.toEntity(request, user);

        assetRepository.save(asset);

        return assetMapper.toResponse(asset);
    }

    public AssetResponse getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        return assetMapper.toResponse(asset);
    }

    public Page<AssetResponse> getAllAssets(Pageable pageable) {
        return assetRepository.findAll(pageable)
                .map(assetMapper::toResponse);
    }

    public AssetResponse updateAsset(Long id, AssetRequest request) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (request.getSn() != null) {
            asset.setSn(request.getSn());
        }

        if (request.getType() != null) {
            asset.setType(request.getType());
        }

        if (request.getBrand() != null) {
            asset.setBrand(request.getBrand());
        }

        if (request.getModel() != null) {
            asset.setModel(request.getModel());
        }

        if (request.getPurchaseDate() != null) {
            asset.setPurchaseDate(request.getPurchaseDate());
        }

        if (request.getWarrantyEndDate() != null) {
            asset.setWarrantyEndDate(request.getWarrantyEndDate());
        }

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            asset.setUser(user);
        }

        assetRepository.save(asset);

        return assetMapper.toResponse(asset);
    }


    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        assetRepository.delete(asset);
    }

    public Page<AssetResponse> getByStatus(String status, Pageable pageable) {
        return assetRepository.findByStatus(status, pageable)
                .map(assetMapper::toResponse);
    }

    public Page<AssetResponse> getByType(String type, Pageable pageable) {
        return assetRepository.findByType(type, pageable)
                .map(assetMapper::toResponse);
    }

    public Page<AssetResponse> getByBrand(String brand, Pageable pageable) {
        return assetRepository.findByBrand(brand, pageable)
                .map(assetMapper::toResponse);
    }

    public Page<AssetResponse> getByUser(Long userId, Pageable pageable) {
        return assetRepository.findByUserId(userId, pageable)
                .map(assetMapper::toResponse);
    }

    public Page<AssetResponse> findAvailableSpareParts(String type, Pageable pageable) {
        return assetRepository.findByTypeAndStatus(type, "AVAILABLE", pageable)
                .map(assetMapper::toResponse);
    }
}