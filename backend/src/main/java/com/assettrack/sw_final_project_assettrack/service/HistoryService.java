package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.request.HistoryRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.HistoryResponse;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.History;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.HistoryMapper;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.HistoryRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final HistoryMapper historyMapper;


    public Page<HistoryResponse> getAssetHistory(Long assetId, Pageable pageable) {
        return historyRepository.findByAssetId(assetId, pageable)
                .map(historyMapper::toResponse);
    }

    public Page<HistoryResponse> getUserHistory(Long userId, Pageable pageable) {
        return historyRepository.findByUserId(userId, pageable)
                .map(historyMapper::toResponse);
    }


    @Transactional
    public HistoryResponse createHistory(HistoryRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        User toUser = userRepository.findById(request.getToUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        historyRepository.findByAssetIdAndReturnedAtIsNull(asset.getId())
                .ifPresent(previousRecord -> {
                    previousRecord.setReturnedAt(request.getAssignedAt());
                    historyRepository.save(previousRecord);
                });

        asset.setUser(toUser);
        assetRepository.save(asset);

        History history = History.builder()
                .asset(asset)
                .user(toUser)
                .note(request.getNote())
                .assignedAt(request.getAssignedAt())
                .build();

        return historyMapper.toResponse(historyRepository.save(history));
    }
}
