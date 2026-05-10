package com.assettrack.sw_final_project_assettrack.repository;

import com.assettrack.sw_final_project_assettrack.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {

    @Query(value = "SELECT h FROM History h JOIN FETCH h.asset JOIN FETCH h.user WHERE h.asset.id = :assetId",
           countQuery = "SELECT count(h) FROM History h WHERE h.asset.id = :assetId")
    Page<History> findByAssetId(@Param("assetId") Long assetId, Pageable pageable);

    @Query(value = "SELECT h FROM History h JOIN FETCH h.asset JOIN FETCH h.user WHERE h.user.id = :userId",
           countQuery = "SELECT count(h) FROM History h WHERE h.user.id = :userId")
    Page<History> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT h FROM History h JOIN FETCH h.asset JOIN FETCH h.user WHERE h.asset.id = :assetId AND h.returnedAt IS NULL")
    Optional<History> findByAssetIdAndReturnedAtIsNull(@Param("assetId") Long assetId);

    @Query("SELECT h FROM History h JOIN FETCH h.user JOIN FETCH h.asset WHERE h.asset.id = :assetId ORDER BY h.assignedAt DESC LIMIT 1")
    Optional<History> findTopByAssetIdOrderByAssignedAtDesc(@Param("assetId") Long assetId);

    @Query(value = "SELECT h FROM History h JOIN FETCH h.asset JOIN FETCH h.user", countQuery = "SELECT count(h) FROM History h")
    Page<History> findAll(Pageable pageable);

    @Query("SELECT h FROM History h JOIN FETCH h.asset JOIN FETCH h.user")
    List<History> findAll();
}
