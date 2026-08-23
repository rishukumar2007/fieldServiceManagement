package com.KEYSTONE.fieldServiceManagement.Repository;

import com.KEYSTONE.fieldServiceManagement.Entity.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {
    Optional<Part> findBySku(String sku);
}
