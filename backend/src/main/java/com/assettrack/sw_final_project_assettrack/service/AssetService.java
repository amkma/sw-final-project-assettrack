package com.assettrack.sw_final_project_assettrack.service;
import com.assettrack.sw_final_project_assettrack.dto.request.AssetRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.AssetSearchRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AssetResponse;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.History;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.AssetMapper;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.HistoryRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import com.assettrack.sw_final_project_assettrack.specification.AssetSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final HistoryRepository historyRepository;
    private final AssetMapper assetMapper;

    @Transactional
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

        if (user != null) {
            asset.setStatus("ASSIGNED");
        } else {
            asset.setStatus("AVAILABLE");
        }

        asset = assetRepository.save(asset);

        if (user != null) {
            History newHistory = History.builder()
                    .asset(asset)
                    .user(user)
                    .assignedAt(LocalDate.now())
                    .note("Assigned to " + user.getFirstName() + " " + user.getLastName())
                    .build();
            historyRepository.save(newHistory);
        }

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

    @Transactional
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
            User currentUser = asset.getUser();
            User newUser = null;

            if (request.getUserId() == -1L) {
                // Explicitly unassign
                asset.setUser(null);
                asset.setStatus("AVAILABLE");
            } else {
                newUser = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                asset.setUser(newUser);
                asset.setStatus("ASSIGNED");
            }

            // Only update history if the user has changed
            boolean userChanged = (currentUser == null && newUser != null) ||
                                  (currentUser != null && !currentUser.equals(newUser));

            if (userChanged) {
                LocalDate now = LocalDate.now();

                // Close existing history if any
                if (currentUser != null) {
                    historyRepository.findByAssetIdAndReturnedAtIsNull(asset.getId())
                            .ifPresent(activeHistory -> {
                                activeHistory.setReturnedAt(now);
                                historyRepository.save(activeHistory);
                            });
                }

                // Create new history if assigned to someone
                if (newUser != null) {
                    History newHistory = History.builder()
                            .asset(asset)
                            .user(newUser)
                            .assignedAt(now)
                            .note("Assigned to " + newUser.getFirstName() + " " + newUser.getLastName())
                            .build();
                    historyRepository.save(newHistory);
                }
            }
        }

        assetRepository.save(asset);

        return assetMapper.toResponse(asset);
    }


    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        assetRepository.delete(asset);
    }



    public Page<AssetResponse> searchAssets(AssetSearchRequest request, Pageable pageable) {

    Specification<Asset> spec = AssetSpecification.filter(request);

    return assetRepository.findAll(spec, pageable)
            .map(assetMapper::toResponse);
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
                .map(asset -> {
                    String lastOwnerName = historyRepository.findTopByAssetIdOrderByAssignedAtDesc(asset.getId())
                            .map(history -> history.getUser().getFirstName() + " " + history.getUser().getLastName())
                            .orElse(null);
                    return assetMapper.toResponse(asset, lastOwnerName);
                });
    }

    public Page<AssetResponse> getAvailableSpareLaptops(Pageable pageable) {
        return assetRepository.findByTypeAndStatus("Laptop", "AVAILABLE", pageable)
                .map(asset -> {
                    String lastOwnerName = historyRepository.findTopByAssetIdOrderByAssignedAtDesc(asset.getId())
                            .map(history -> history.getUser().getFirstName() + " " + history.getUser().getLastName())
                            .orElse("N/A");
                    return assetMapper.toResponse(asset, lastOwnerName);
                });
    }



    //=========================USER-RELATED METHODS=========================

    public Page<AssetResponse> getMyAssets(Long userId, Pageable pageable) {
    return assetRepository.findByUserId(userId, pageable)
            .map(assetMapper::toResponse);
    }

    public Page<AssetResponse> getMyAssetsByStatus(
            Long userId,
            String status,
            Pageable pageable
    ) {
        return assetRepository.findByUserIdAndStatus(userId, status, pageable)
                .map(assetMapper::toResponse);
    }

    public Page<AssetResponse> searchMyAssets(
            Long userId,
            AssetSearchRequest request,
            Pageable pageable
    ) {
        request.setUserId(userId);

        return assetRepository.findAll(
                AssetSpecification.filter(request),
                pageable
        ).map(assetMapper::toResponse);
    }
}