package com.KEYSTONE.fieldServiceManagement.repository;

import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderStatusHistoryRepository extends JpaRepository<WorkOrderStatusHistory, String> {
    List<WorkOrderStatusHistory> findByWorkOrderIdOrderByChangedAtDesc(String workOrderId);
}
