package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query(value = "SELECT n FROM Notification n JOIN FETCH n.user WHERE n.user.id = :userId ORDER BY n.date DESC, n.id DESC",
           countQuery = "SELECT count(n) FROM Notification n WHERE n.user.id = :userId")
    Page<Notification> findByUserIdOrderByDateDescIdDesc(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n JOIN FETCH n.user WHERE n.user.id = :userId")
    List<Notification> findByUserId(@Param("userId") Long userId);

    long countByUserIdAndIsReadFalse(Long userId); 

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);
    
    @Query(value = "SELECT n FROM Notification n JOIN FETCH n.user", countQuery = "SELECT count(n) FROM Notification n")
    Page<Notification> findAll(Pageable pageable);

    @Query("SELECT n FROM Notification n JOIN FETCH n.user")
    List<Notification> findAll();
}
