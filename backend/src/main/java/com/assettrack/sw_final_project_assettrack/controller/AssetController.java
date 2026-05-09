package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.AssetRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.AssetSearchRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AssetResponse;
import com.assettrack.sw_final_project_assettrack.security.CustomUserDetails;
import com.assettrack.sw_final_project_assettrack.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    public AssetResponse createAsset(@Valid @RequestBody AssetRequest request) {
        return assetService.createAsset(request);
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/{id}")
    public AssetResponse getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping
    public Page<AssetResponse> getAllAssets(Pageable pageable) {
        return assetService.getAllAssets(pageable);
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}")
    public AssetResponse updateAsset(
            @PathVariable Long id,
            @RequestBody AssetRequest request
    ) {
        return assetService.updateAsset(id, request);
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/status/{status}")
    public Page<AssetResponse> getByStatus(
            @PathVariable String status,
            Pageable pageable
    ) {
        return assetService.getByStatus(status, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/type/{type}")
    public Page<AssetResponse> getByType(
            @PathVariable String type,
            Pageable pageable
    ) {
        return assetService.getByType(type, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/brand/{brand}")
    public Page<AssetResponse> getByBrand(
            @PathVariable String brand,
            Pageable pageable
    ) {
        return assetService.getByBrand(brand, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/user/{userId}")
    public Page<AssetResponse> getByUser(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        return assetService.getByUser(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/spare-parts/{type}")
    public Page<AssetResponse> findAvailableSpareParts(
            @PathVariable String type,
            Pageable pageable
    ) {
        return assetService.findAvailableSpareParts(type, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/search")
    public Page<AssetResponse> searchAssets(
            @RequestBody AssetSearchRequest request,
            Pageable pageable
    ) {
        return assetService.searchAssets(request, pageable);
    }


    //============================USER SPECIFIC ENDPOINTS============================

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public Page<AssetResponse> getMyAssets(
            @AuthenticationPrincipal CustomUserDetails user,
            Pageable pageable
    ) {
        return assetService.getMyAssets(user.getId(), pageable);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me/status/{status}")
    public Page<AssetResponse> getMyAssetsByStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String status,
            Pageable pageable
    ) {
        return assetService.getMyAssetsByStatus(
                user.getId(),
                status,
                pageable
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/me/search")
    public Page<AssetResponse> searchMyAssets(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody AssetSearchRequest request,
            Pageable pageable
    ) {
        return assetService.searchMyAssets(
                user.getId(),
                request,
                pageable
        );
    }
}
