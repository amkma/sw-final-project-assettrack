package com.assettrack.sw_final_project_assettrack.dto.response;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private Map<String, Long> statusDistribution;
    private Map<String, Long> typeDistribution;
    private long totalAssets;
    private long totalUsers;
    private long activeReports;
}
