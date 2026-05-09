package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ReportRepository extends JpaRepository<Report, Long> {


    Page<Report> findByAssetId(Long assetId, Pageable pageable);

    Page<Report> findByUserId(Long userId, Pageable pageable);

    Page<Report> findByStatus(String status, Pageable pageable);
    Page<Report> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

    long countByStatus(String status);

}
