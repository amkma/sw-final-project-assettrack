package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;


public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query(value = "SELECT r FROM Report r JOIN FETCH r.asset JOIN FETCH r.user WHERE r.asset.id = :assetId",
           countQuery = "SELECT count(r) FROM Report r WHERE r.asset.id = :assetId")
    Page<Report> findByAssetId(@Param("assetId") Long assetId, Pageable pageable);

    @Query(value = "SELECT r FROM Report r JOIN FETCH r.asset JOIN FETCH r.user WHERE r.user.id = :userId",
           countQuery = "SELECT count(r) FROM Report r WHERE r.user.id = :userId")
    Page<Report> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query(value = "SELECT r FROM Report r JOIN FETCH r.asset JOIN FETCH r.user WHERE r.status = :status",
           countQuery = "SELECT count(r) FROM Report r WHERE r.status = :status")
    Page<Report> findByStatus(@Param("status") String status, Pageable pageable);

    @Query(value = "SELECT r FROM Report r JOIN FETCH r.asset JOIN FETCH r.user WHERE r.user.id = :userId AND r.status = :status",
           countQuery = "SELECT count(r) FROM Report r WHERE r.user.id = :userId AND r.status = :status")
    Page<Report> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status, Pageable pageable);

    long countByStatus(String status);

    @Query(value = "SELECT r FROM Report r JOIN FETCH r.asset JOIN FETCH r.user", countQuery = "SELECT count(r) FROM Report r")
    Page<Report> findAll(Pageable pageable);

    @Query("SELECT r FROM Report r JOIN FETCH r.asset JOIN FETCH r.user")
    List<Report> findAll();
}
