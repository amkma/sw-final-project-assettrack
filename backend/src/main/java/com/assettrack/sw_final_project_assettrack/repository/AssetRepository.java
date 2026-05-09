package com.assettrack.sw_final_project_assettrack.repository;

import com.assettrack.sw_final_project_assettrack.entity.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AssetRepository extends JpaRepository<Asset, Long>,JpaSpecificationExecutor<Asset> {

   
    Asset findBySn(String serialNumber);

    boolean existsBySn(String serialNumber);

    Page<Asset> findByStatus(String status, Pageable pageable);

    Page<Asset> findByType(String type, Pageable pageable);

    Page<Asset> findByBrand(String brand, Pageable pageable);

    Page<Asset> findByUserId(Long userId, Pageable pageable);

    Page<Asset> findByTypeAndStatus(String type, String status, Pageable pageable);

    Page<Asset> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

    Page<Asset> findByUserIdAndType(Long userId, String type, Pageable pageable);

    Page<Asset> findByUserIdAndBrand(Long userId, String brand, Pageable pageable);
}