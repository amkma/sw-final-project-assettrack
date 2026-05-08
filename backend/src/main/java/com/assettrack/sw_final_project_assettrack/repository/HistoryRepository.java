package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findByAssetId(Long assetId);

    List<History> findByToUserId(Long userId);// to see history of a specific user

    
}
