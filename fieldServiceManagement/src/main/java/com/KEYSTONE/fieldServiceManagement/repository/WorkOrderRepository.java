package com.KEYSTONE.fieldServiceManagement.repository;

import com.KEYSTONE.fieldServiceManagement.model.WorkOrder;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.model.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, String> {
    Optional<WorkOrder> findByCode(String code);
    List<WorkOrder> findByStatus(WorkOrderStatus status);
    List<WorkOrder> findByAssignedToId(String assignedToId);
    List<WorkOrder> findByCustomerId(String customerId);
    List<WorkOrder> findByPriority(Priority priority);
    
    long countByStatus(WorkOrderStatus status);
    
    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.status NOT IN (com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus.COMPLETED, com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus.CLOSED, com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus.CANCELLED) AND w.slaDueAt < :now")
    long countOverdueWorkOrders(@Param("now") LocalDateTime now);
}
