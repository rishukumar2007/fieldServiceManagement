package com.KEYSTONE.fieldServiceManagement.Repository;

import com.KEYSTONE.fieldServiceManagement.Entity.WorkOrder;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    Optional<WorkOrder> findByCode(String code);
    List<WorkOrder> findByCustomerId(Long customerId);
    List<WorkOrder> findByAssignedToId(Long technicianId);
    List<WorkOrder> findByStatus(WorkOrderStatus status);
}
