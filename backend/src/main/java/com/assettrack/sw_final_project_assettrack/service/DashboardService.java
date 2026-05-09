package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.response.DashboardResponse;
import com.assettrack.sw_final_project_assettrack.repository.AssetRepository;
import com.assettrack.sw_final_project_assettrack.repository.ReportRepository;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    public DashboardResponse getStats() {
        Map<String, Long> statusDistribution = new HashMap<>();
        List<Object[]> statusCounts = assetRepository.countByStatus();
        for (Object[] result : statusCounts) {
            statusDistribution.put((String) result[0], (Long) result[1]);
        }

        Map<String, Long> typeDistribution = new HashMap<>();
        List<Object[]> typeCounts = assetRepository.countByType();
        for (Object[] result : typeCounts) {
            typeDistribution.put((String) result[0], (Long) result[1]);
        }

        return DashboardResponse.builder()
                .statusDistribution(statusDistribution)
                .typeDistribution(typeDistribution)
                .totalAssets(assetRepository.count())
                .totalUsers(userRepository.count())
                .activeReports(reportRepository.countByStatus("PENDING"))
                .build();
    }
}
