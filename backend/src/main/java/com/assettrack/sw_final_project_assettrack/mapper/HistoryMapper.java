package com.assettrack.sw_final_project_assettrack.mapper;
import com.assettrack.sw_final_project_assettrack.dto.response.HistoryResponse;
import com.assettrack.sw_final_project_assettrack.entity.History;
import org.springframework.stereotype.Component;

@Component
public class HistoryMapper {

    public HistoryResponse toResponse(History history) {
        return HistoryResponse.builder()
                .id(history.getId())
                .note(history.getNote())
                .assignedAt(history.getAssignedAt())
                .returnedAt(history.getReturnedAt())
                .userId(history.getUser().getId())
                .assetId(history.getAsset().getId())
                .build();
    }
}
