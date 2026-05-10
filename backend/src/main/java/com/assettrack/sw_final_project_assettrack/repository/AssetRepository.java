package com.assettrack.sw_final_project_assettrack.repository;

import com.assettrack.sw_final_project_assettrack.entity.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long>,JpaSpecificationExecutor<Asset> {

    @Query("SELECT a.status, COUNT(a) FROM Asset a GROUP BY a.status")
    List<Object[]> countByStatus();

    @Query("SELECT a.type, COUNT(a) FROM Asset a GROUP BY a.type")
    List<Object[]> countByType();

    @Query("SELECT a.type, SUM(CASE WHEN a.status = :status THEN 1 ELSE 0 END) FROM Asset a GROUP BY a.type")
    List<Object[]> countByTypeAndStatus(@Param("status") String status);

    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.sn = :serialNumber")
    Asset findBySn(@Param("serialNumber") String serialNumber);

    boolean existsBySn(String serialNumber);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.status = :status",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.status = :status")
    Page<Asset> findByStatus(@Param("status") String status, Pageable pageable);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.type = :type",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.type = :type")
    Page<Asset> findByType(@Param("type") String type, Pageable pageable);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.brand = :brand",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.brand = :brand")
    Page<Asset> findByBrand(@Param("brand") String brand, Pageable pageable);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.user.id = :userId",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.user.id = :userId")
    Page<Asset> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.user.id = :userId")
    List<Asset> findAllByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.type = :type AND a.status = :status",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.type = :type AND a.status = :status")
    Page<Asset> findByTypeAndStatus(@Param("type") String type, @Param("status") String status, Pageable pageable);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.user.id = :userId AND a.status = :status",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.user.id = :userId AND a.status = :status")
    Page<Asset> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status, Pageable pageable);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.user.id = :userId AND a.type = :type",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.user.id = :userId AND a.type = :type")
    Page<Asset> findByUserIdAndType(@Param("userId") Long userId, @Param("type") String type, Pageable pageable);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.user.id = :userId AND a.brand = :brand",
           countQuery = "SELECT count(a) FROM Asset a WHERE a.user.id = :userId AND a.brand = :brand")
    Page<Asset> findByUserIdAndBrand(@Param("userId") Long userId, @Param("brand") String brand, Pageable pageable);

    // Warranty expiration queries — only assets not yet notified
    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.warrantyEndDate BETWEEN :start AND :end AND a.warrantyNotified = false")
    List<Asset> findByWarrantyEndDateBetweenAndWarrantyNotifiedFalse(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.user WHERE a.warrantyEndDate < :date AND a.warrantyNotified = false")
    List<Asset> findByWarrantyEndDateBeforeAndWarrantyNotifiedFalse(@Param("date") LocalDate date);

    @Query(value = "SELECT a FROM Asset a LEFT JOIN FETCH a.user", countQuery = "SELECT count(a) FROM Asset a")
    Page<Asset> findAll(Pageable pageable);

    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.user")
    List<Asset> findAll();
}