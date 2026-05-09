package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.AssetRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.AssetSearchRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AssetResponse;
import com.assettrack.sw_final_project_assettrack.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public AssetResponse createAsset(@Valid @RequestBody AssetRequest request) {
        return assetService.createAsset(request);
    }

    @GetMapping("/{id}")
    public AssetResponse getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @GetMapping
    public Page<AssetResponse> getAllAssets(Pageable pageable) {
        return assetService.getAllAssets(pageable);
    }

    @PutMapping("/{id}")
    public AssetResponse updateAsset(
            @PathVariable Long id,
            @RequestBody AssetRequest request
    ) {
        return assetService.updateAsset(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    @GetMapping("/status/{status}")
    public Page<AssetResponse> getByStatus(
            @PathVariable String status,
            Pageable pageable
    ) {
        return assetService.getByStatus(status, pageable);
    }

    @GetMapping("/type/{type}")
    public Page<AssetResponse> getByType(
            @PathVariable String type,
            Pageable pageable
    ) {
        return assetService.getByType(type, pageable);
    }

    @GetMapping("/brand/{brand}")
    public Page<AssetResponse> getByBrand(
            @PathVariable String brand,
            Pageable pageable
    ) {
        return assetService.getByBrand(brand, pageable);
    }

    @GetMapping("/user/{userId}")
    public Page<AssetResponse> getByUser(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        return assetService.getByUser(userId, pageable);
    }

    @GetMapping("/spare-parts/{type}")
    public Page<AssetResponse> findAvailableSpareParts(
            @PathVariable String type,
            Pageable pageable
    ) {
        return assetService.findAvailableSpareParts(type, pageable);
    }
    @PostMapping("/search")
    public Page<AssetResponse> searchAssets(
            @RequestBody AssetSearchRequest request,
            Pageable pageable
    ) {
        return assetService.searchAssets(request, pageable);
    }
}
