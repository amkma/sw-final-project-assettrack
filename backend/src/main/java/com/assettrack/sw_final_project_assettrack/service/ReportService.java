package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.request.ReportRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.ReportResponse;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.Report;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.ReportMapper;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.ReportRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final ReportMapper reportMapper;
    private final NotificationService notificationService;

    /*
        ================= USER METHODS =================
     */

    public ReportResponse createReport(Long userId, ReportRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        Report report = reportMapper.toEntity(request, user, asset);

        Report saved = reportRepository.save(report);

        // Notify Admins and Managers
        String message = "New report submitted by " + user.getFirstName() + " for asset " + asset.getSn();
        userRepository.findByRoleId(1L).forEach(manager -> 
            notificationService.createNotification(manager.getId(), message)
        );
        userRepository.findByRoleId(2L).forEach(admin -> 
            notificationService.createNotification(admin.getId(), message)
        );

        return reportMapper.toResponse(saved);
    }

    public ReportResponse getMyReportById(Long userId, Long reportId) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!report.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return reportMapper.toResponse(report);
    }

    public Page<ReportResponse> getMyReports(Long userId, Pageable pageable) {
        return reportRepository.findByUserId(userId, pageable)
                .map(reportMapper::toResponse);
    }

    public Page<ReportResponse> getMyReportsByStatus(
            Long userId,
            String status,
            Pageable pageable
    ) {
        return reportRepository.findByUserIdAndStatus(userId, status, pageable)
                .map(reportMapper::toResponse);
    }

    /*
        ================= ADMIN / MANAGER METHODS =================
     */

    public ReportResponse getReportById(Long id) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        return reportMapper.toResponse(report);
    }

    public Page<ReportResponse> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable)
                .map(reportMapper::toResponse);
    }

    public ReportResponse updateStatus(Long id, String status) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);

        Report saved = reportRepository.save(report);

        return reportMapper.toResponse(saved);
    }

    public void deleteReport(Long id) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        reportRepository.delete(report);
    }

    public Page<ReportResponse> getByStatus(String status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable)
                .map(reportMapper::toResponse);
    }

    public Page<ReportResponse> getByUser(Long userId, Pageable pageable) {
        return reportRepository.findByUserId(userId, pageable)
                .map(reportMapper::toResponse);
    }

    public Page<ReportResponse> getByAsset(Long assetId, Pageable pageable) {
        return reportRepository.findByAssetId(assetId, pageable)
                .map(reportMapper::toResponse);
    }
}