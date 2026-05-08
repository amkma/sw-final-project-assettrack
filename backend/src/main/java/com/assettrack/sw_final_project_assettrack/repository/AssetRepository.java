package com.assettrack.sw_final_project_assettrack.repository;

import com.assettrack.sw_final_project_assettrack.entity.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {

   
    Asset findBySn(String serialNumber);

    boolean existsBySn(String serialNumber);

    Page<Asset> findByStatus(String status, Pageable pageable);

    Page<Asset> findByType(String type, Pageable pageable);

    Page<Asset> findByBrand(String brand, Pageable pageable);

    Page<Asset> findByUserId(Long userId, Pageable pageable);

    Page<Asset> findByTypeAndStatus(String type, String status, Pageable pageable);
}