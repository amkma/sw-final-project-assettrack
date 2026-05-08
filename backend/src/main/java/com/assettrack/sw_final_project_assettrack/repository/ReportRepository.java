package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ReportRepository extends JpaRepository<Report, Long> {


    List<Report> findByAssetId(Long assetId);

    List<Report> findByUserId(Long userId); 

    List<Report> findByStatus(String status);//

    

}
