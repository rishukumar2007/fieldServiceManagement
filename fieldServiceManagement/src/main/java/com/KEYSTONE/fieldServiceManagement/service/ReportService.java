package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.DashboardSummaryDto;
import com.KEYSTONE.fieldServiceManagement.dto.TechnicianPerformanceDto;
import com.KEYSTONE.fieldServiceManagement.model.Role;
import com.KEYSTONE.fieldServiceManagement.model.User;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrder;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.repository.WorkOrderRepository;
import com.KEYSTONE.fieldServiceManagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReportService {

    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    public ReportService(WorkOrderRepository workOrderRepository, UserRepository userRepository) {
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    public DashboardSummaryDto getDashboardSummary() {
        List<WorkOrder> all = workOrderRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        long total = all.size();
        long open = all.stream().filter(w -> w.getStatus() != WorkOrderStatus.COMPLETED && w.getStatus() != WorkOrderStatus.CLOSED && w.getStatus() != WorkOrderStatus.CANCELLED).count();
        long inProgress = all.stream().filter(w -> w.getStatus() == WorkOrderStatus.IN_PROGRESS).count();
        long completed = all.stream().filter(w -> w.getStatus() == WorkOrderStatus.COMPLETED || w.getStatus() == WorkOrderStatus.CLOSED).count();
        long overdue = workOrderRepository.countOverdueWorkOrders(now);

        double slaCompliantPercentage = total > 0 ? ((double) (total - overdue) / total) * 100.0 : 100.0;

        return DashboardSummaryDto.builder()
                .totalWorkOrders(total)
                .openWorkOrders(open)
                .inProgressWorkOrders(inProgress)
                .completedWorkOrders(completed)
                .overdueWorkOrders(overdue)
                .slaCompliancePercentage(Math.round(slaCompliantPercentage * 10.0) / 10.0)
                .build();
    }

    public List<TechnicianPerformanceDto> getTechnicianPerformance() {
        List<User> technicians = userRepository.findByRole(Role.TECHNICIAN);
        List<WorkOrder> allOrders = workOrderRepository.findAll();

        List<TechnicianPerformanceDto> dtos = new ArrayList<>();

        for (User tech : technicians) {
            List<WorkOrder> techOrders = allOrders.stream()
                    .filter(w -> w.getAssignedTo() != null && tech.getId().equals(w.getAssignedTo().getId()))
                    .toList();

            long assignedCount = techOrders.size();
            long completedCount = techOrders.stream()
                    .filter(w -> w.getStatus() == WorkOrderStatus.COMPLETED || w.getStatus() == WorkOrderStatus.CLOSED)
                    .count();

            int totalLabor = techOrders.stream()
                    .mapToInt(w -> w.getLaborMinutes() != null ? w.getLaborMinutes() : 0)
                    .sum();

            dtos.add(TechnicianPerformanceDto.builder()
                    .technicianId(tech.getId())
                    .technicianName(tech.getName())
                    .assignedCount(assignedCount)
                    .completedCount(completedCount)
                    .totalLaborMinutes(totalLabor)
                    .build());
        }

        return dtos;
    }
}
