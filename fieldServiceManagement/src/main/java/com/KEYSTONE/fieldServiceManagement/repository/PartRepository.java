package com.KEYSTONE.fieldServiceManagement.repository;

import com.KEYSTONE.fieldServiceManagement.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartRepository extends JpaRepository<Part, String> {
    Optional<Part> findBySku(String sku);
    Optional<Part> findBySkuIgnoreCase(String sku);
    List<Part> findByStockQtyLessThan(int stockQty);
}
