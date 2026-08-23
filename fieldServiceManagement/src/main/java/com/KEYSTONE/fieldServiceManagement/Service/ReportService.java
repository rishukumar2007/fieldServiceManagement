package com.KEYSTONE.fieldServiceManagement.Service;

import com.KEYSTONE.fieldServiceManagement.Dto.DashboardSummaryDto;
import com.KEYSTONE.fieldServiceManagement.Entity.WorkOrder;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.Repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    public DashboardSummaryDto getDashboardSummary() {
        List<WorkOrder> allWorkOrders = workOrderRepository.findAll();
        long total = allWorkOrders.size();

        long open = allWorkOrders.stream()
                .filter(w -> w.getStatus() == WorkOrderStatus.NEW || w.getStatus() == WorkOrderStatus.ASSIGNED)
                .count();

        long inProgress = allWorkOrders.stream()
                .filter(w -> w.getStatus() == WorkOrderStatus.IN_PROGRESS || w.getStatus() == WorkOrderStatus.ON_HOLD)
                .count();

        long completed = allWorkOrders.stream()
                .filter(w -> w.getStatus() == WorkOrderStatus.COMPLETED || w.getStatus() == WorkOrderStatus.CLOSED)
                .count();

        LocalDateTime now = LocalDateTime.now();
        long overdue = allWorkOrders.stream()
                .filter(w -> w.getSlaDueAt() != null && w.getSlaDueAt().isBefore(now) &&
                        w.getStatus() != WorkOrderStatus.COMPLETED &&
                        w.getStatus() != WorkOrderStatus.CLOSED &&
                        w.getStatus() != WorkOrderStatus.CANCELLED)
                .count();

        double compliance = total > 0 ? ((double) (total - overdue) / total) * 100.0 : 100.0;

        Map<String, Long> breakdown = allWorkOrders.stream()
                .collect(Collectors.groupingBy(w -> w.getStatus().name(), Collectors.counting()));

        return DashboardSummaryDto.builder()
                .totalWorkOrders(total)
                .openWorkOrders(open)
                .inProgressWorkOrders(inProgress)
                .completedWorkOrders(completed)
                .overdueWorkOrders(overdue)
                .slaCompliancePercentage(Math.round(compliance * 10.0) / 10.0)
                .statusBreakdown(breakdown)
                .build();
    }
}
