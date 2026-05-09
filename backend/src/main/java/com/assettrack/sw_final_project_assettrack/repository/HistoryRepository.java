package com.assettrack.sw_final_project_assettrack.repository;

import com.assettrack.sw_final_project_assettrack.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HistoryRepository extends JpaRepository<History, Long> {

    Page<History> findByAssetId(Long assetId, Pageable pageable);

    Page<History> findByUserId(Long userId, Pageable pageable);

    Optional<History> findByAssetIdAndReturnedAtIsNull(Long assetId);

    Optional<History> findTopByAssetIdOrderByAssignedAtDesc(Long assetId);

}
