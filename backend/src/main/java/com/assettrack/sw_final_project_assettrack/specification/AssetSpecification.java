package com.assettrack.sw_final_project_assettrack.specification;

import com.assettrack.sw_final_project_assettrack.dto.request.AssetSearchRequest;
import com.assettrack.sw_final_project_assettrack.entity.Asset;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AssetSpecification {

    public static Specification<Asset> filter(AssetSearchRequest req) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (req.getType() != null) {
                predicates.add(cb.equal(root.get("type"), req.getType()));
            }

            if (req.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), req.getStatus()));
            }

            if (req.getBrand() != null) {
                predicates.add(cb.equal(root.get("brand"), req.getBrand()));
            }

            if (req.getUserId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), req.getUserId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}