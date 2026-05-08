package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.HistoryRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.HistoryResponse;
import com.assettrack.sw_final_project_assettrack.service.HistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<Page<HistoryResponse>> getAssetHistory(
            @PathVariable Long assetId,
            Pageable pageable) {
        return ResponseEntity.ok(historyService.getAssetHistory(assetId, pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<HistoryResponse>> getUserHistory(
            @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(historyService.getUserHistory(userId, pageable));
    }

    @PostMapping
    public ResponseEntity<HistoryResponse> createHistory(@Valid @RequestBody HistoryRequest request) {
        return ResponseEntity.ok(historyService.createHistory(request));
    }
}
