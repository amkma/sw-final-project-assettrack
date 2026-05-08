package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Asset findBySn(String serialNumber);

    boolean existsBySn(String serialNumber);

    List<Asset> findByStatus(String status);// we forgot to add status in entity

    List<Asset> findByType(String type);

    List<Asset> findByBrand(String brand);

    List<Asset> findByUserId(Long userId);

    List<Asset> findByTypeAndStatus(String type,String status); // to find available spare parts of a specific type
    //and status =available  

}
