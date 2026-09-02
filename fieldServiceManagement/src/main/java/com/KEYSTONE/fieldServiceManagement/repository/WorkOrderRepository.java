package com.KEYSTONE.fieldServiceManagement.repository;

import com.KEYSTONE.fieldServiceManagement.model.Priority;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrder;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, String> {
    Optional<WorkOrder> findByCode(String code);
    List<WorkOrder> findByCustomerId(String customerId);
    List<WorkOrder> findByAssignedToId(String assignedToId);
    List<WorkOrder> findByStatus(WorkOrderStatus status);
    List<WorkOrder> findByPriority(Priority priority);
    List<WorkOrder> findByStatusAndPriority(WorkOrderStatus status, Priority priority);
}
