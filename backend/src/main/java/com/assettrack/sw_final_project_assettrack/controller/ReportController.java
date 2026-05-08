package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.ReportRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.ReportResponse;
import com.assettrack.sw_final_project_assettrack.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;


    @PostMapping
    public ReportResponse createReport(@Valid @RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }


    @GetMapping("/{id}")
    public ReportResponse getReportById(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

   
    @GetMapping
    public Page<ReportResponse> getAllReports(Pageable pageable) {
        return reportService.getAllReports(pageable);
    }


    @PatchMapping("/{id}/status")
    public ReportResponse updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return reportService.updateStatus(id, status);
    }


    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
    }

    @GetMapping("/status/{status}")
    public Page<ReportResponse> getByStatus(
            @PathVariable String status,
            Pageable pageable
    ) {
        return reportService.getByStatus(status, pageable);
    }

    @GetMapping("/user/{userId}")
    public Page<ReportResponse> getByUser(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        return reportService.getByUser(userId, pageable);
    }


    @GetMapping("/asset/{assetId}")
    public Page<ReportResponse> getByAsset(
            @PathVariable Long assetId,
            Pageable pageable
    ) {
        return reportService.getByAsset(assetId, pageable);
    }
}