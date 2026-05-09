package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.ReportRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.ReportResponse;
import com.assettrack.sw_final_project_assettrack.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.assettrack.sw_final_project_assettrack.security.CustomUserDetails;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /*
        ================= USER =================
     */

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ReportResponse createReport(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody ReportRequest request
    ) {
        return reportService.createReport(user.getId(), request);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public Page<ReportResponse> getMyReports(
            @AuthenticationPrincipal CustomUserDetails user,
            Pageable pageable
    ) {
        return reportService.getByUser(user.getId(), pageable);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me/{id}")
    public ReportResponse getMyReportById(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id
    ) {
        return reportService.getMyReportById(user.getId(), id);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me/status/{status}")
    public Page<ReportResponse> getMyReportsByStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String status,
            Pageable pageable
    ) {
        return reportService.getMyReportsByStatus(
                user.getId(),
                status,
                pageable
        );
    }

    /*
        ================= ADMIN / MANAGER =================
     */

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/{id}")
    public ReportResponse getReportById(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping
    public Page<ReportResponse> getAllReports(Pageable pageable) {
        return reportService.getAllReports(pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PatchMapping("/{id}/status")
    public ReportResponse updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return reportService.updateStatus(id, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/status/{status}")
    public Page<ReportResponse> getByStatus(
            @PathVariable String status,
            Pageable pageable
    ) {
        return reportService.getByStatus(status, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/user/{userId}")
    public Page<ReportResponse> getByUser(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        return reportService.getByUser(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/asset/{assetId}")
    public Page<ReportResponse> getByAsset(
            @PathVariable Long assetId,
            Pageable pageable
    ) {
        return reportService.getByAsset(assetId, pageable);
    }
}