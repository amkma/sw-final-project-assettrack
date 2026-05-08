package com.assettrack.sw_final_project_assettrack.repository;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Asset findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<Asset> findByStatus(String status);// we forget to add status in entity

    List<Asset> findByType(String type);

    List<Asset> findByBrand(String brand);

    List<Asset> findByCurrentOwner(Long userId);

    List<Asset> findSparePart(String type,String status); // to find available spare parts of a specific type
    //and status =available  

}
