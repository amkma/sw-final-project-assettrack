package com.assettrack.sw_final_project_assettrack.mapper;
import com.assettrack.sw_final_project_assettrack.dto.request.ReportRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.ReportResponse;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import com.assettrack.sw_final_project_assettrack.entity.Report;
import com.assettrack.sw_final_project_assettrack.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ReportMapper {

    public Report toEntity(ReportRequest request, User user, Asset asset) {
        return Report.builder()
                .description(request.getDescription())
                .date(LocalDate.now())
                .user(user)
                .asset(asset)
                .build();
    }

    public ReportResponse toResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .description(report.getDescription())
                .date(report.getDate())
                .status(report.getStatus())
                .build();
    }
}