package com.assettrack.sw_final_project_assettrack.repository;

import com.assettrack.sw_final_project_assettrack.entity.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long>,JpaSpecificationExecutor<Asset> {

    @Query("SELECT a.status, COUNT(a) FROM Asset a GROUP BY a.status")
    List<Object[]> countByStatus();

    @Query("SELECT a.type, COUNT(a) FROM Asset a GROUP BY a.type")
    List<Object[]> countByType();


   
    Asset findBySn(String serialNumber);

    boolean existsBySn(String serialNumber);

    Page<Asset> findByStatus(String status, Pageable pageable);

    Page<Asset> findByType(String type, Pageable pageable);

    Page<Asset> findByBrand(String brand, Pageable pageable);

    Page<Asset> findByUserId(Long userId, Pageable pageable);

    List<Asset> findAllByUserId(Long userId);

    Page<Asset> findByTypeAndStatus(String type, String status, Pageable pageable);

    Page<Asset> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

    Page<Asset> findByUserIdAndType(Long userId, String type, Pageable pageable);

    Page<Asset> findByUserIdAndBrand(Long userId, String brand, Pageable pageable);
}