package com.KEYSTONE.fieldServiceManagement.Service;

import com.KEYSTONE.fieldServiceManagement.Dto.*;
import com.KEYSTONE.fieldServiceManagement.Entity.*;
import com.KEYSTONE.fieldServiceManagement.Enum.Priority;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class WorkOrderService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkOrderStatusHistoryRepository historyRepository;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private PartUsageRepository partUsageRepository;

    @Autowired
    private TimeLogRepository timeLogRepository;

    public List<WorkOrderDto> getAllWorkOrders() {
        return workOrderRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public WorkOrderDto getWorkOrderById(Long id) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("WorkOrder not found with ID: " + id));
        return mapToDto(wo);
    }

    @Transactional
    public WorkOrderDto createWorkOrder(CreateWorkOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new IllegalArgumentException("Site not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime slaDueAt = computeSlaDueDate(now, request.getPriority());
        String code = "WO-" + (1000 + new Random().nextInt(9000));

        WorkOrder workOrder = WorkOrder.builder()
                .code(code)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(WorkOrderStatus.NEW)
                .createdAt(now)
                .slaDueAt(slaDueAt)
                .customer(customer)
                .site(site)
                .partsCost(0.0)
                .laborMinutes(0)
                .build();

        WorkOrder saved = workOrderRepository.save(workOrder);

        // Audit Trail entry
        recordStatusHistory(saved, null, WorkOrderStatus.NEW, null, "Work order created");

        return mapToDto(saved);
    }

    @Transactional
    public WorkOrderDto assignTechnician(Long workOrderId, Long technicianId, String note) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("WorkOrder not found"));

        User tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new IllegalArgumentException("Technician not found"));

        WorkOrderStatus prevStatus = wo.getStatus();
        validateTransition(prevStatus, WorkOrderStatus.ASSIGNED);

        wo.setAssignedTo(tech);
        wo.setStatus(WorkOrderStatus.ASSIGNED);

        WorkOrder updated = workOrderRepository.save(wo);
        recordStatusHistory(updated, prevStatus, WorkOrderStatus.ASSIGNED, tech, note != null ? note : "Assigned to " + tech.getName());

        return mapToDto(updated);
    }

    /**
     * Governed State Machine Transition (PDF Section 07)
     */
    @Transactional
    public WorkOrderDto transitionStatus(Long workOrderId, WorkOrderStatus nextStatus, String note, Long actingUserId) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("WorkOrder not found"));

        WorkOrderStatus currentStatus = wo.getStatus();
        validateTransition(currentStatus, nextStatus);

        User actingUser = actingUserId != null ? userRepository.findById(actingUserId).orElse(null) : null;

        wo.setStatus(nextStatus);
        WorkOrder updated = workOrderRepository.save(wo);

        recordStatusHistory(updated, currentStatus, nextStatus, actingUser, note);

        return mapToDto(updated);
    }

    /**
     * Transactional Parts Usage Logging (PDF Section 09.1 F6)
     */
    @Transactional
    public WorkOrderDto logPartUsage(Long workOrderId, Long partId, Integer quantity) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("WorkOrder not found"));

        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new IllegalArgumentException("Part not found"));

        if (part.getStockQty() < quantity) {
            throw new IllegalArgumentException("Insufficient inventory stock! Available: " + part.getStockQty() + ", Requested: " + quantity);
        }

        // Decrement stock
        part.setStockQty(part.getStockQty() - quantity);
        partRepository.save(part);

        double totalCost = part.getUnitCost() * quantity;

        PartUsage usage = PartUsage.builder()
                .workOrder(wo)
                .part(part)
                .partName(part.getName())
                .unitCost(part.getUnitCost())
                .qtyUsed(quantity)
                .totalCost(totalCost)
                .build();
        partUsageRepository.save(usage);

        // Update WorkOrder rolled-up parts cost
        wo.setPartsCost(wo.getPartsCost() + totalCost);
        WorkOrder updated = workOrderRepository.save(wo);

        return mapToDto(updated);
    }

    @Transactional
    public WorkOrderDto logTimeSpent(Long workOrderId, Integer minutes, String note, Long technicianId) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("WorkOrder not found"));

        User tech = technicianId != null ? userRepository.findById(technicianId).orElse(wo.getAssignedTo()) : wo.getAssignedTo();

        TimeLog timeLog = TimeLog.builder()
                .workOrder(wo)
                .technician(tech)
                .minutes(minutes)
                .note(note)
                .createdAt(LocalDateTime.now())
                .build();
        timeLogRepository.save(timeLog);

        wo.setLaborMinutes(wo.getLaborMinutes() + minutes);
        WorkOrder updated = workOrderRepository.save(wo);

        return mapToDto(updated);
    }

    // Governed State Machine Rules Validation (PDF Section 07)
    private void validateTransition(WorkOrderStatus current, WorkOrderStatus next) {
        if (current == next) return;

        // Terminal states cannot transition further
        if (current == WorkOrderStatus.CLOSED || current == WorkOrderStatus.CANCELLED) {
            throw new IllegalStateException("Terminal state! Cannot transition out of " + current);
        }

        boolean valid = false;
        switch (current) {
            case NEW:
                valid = (next == WorkOrderStatus.ASSIGNED || next == WorkOrderStatus.CANCELLED);
                break;
            case ASSIGNED:
                valid = (next == WorkOrderStatus.IN_PROGRESS || next == WorkOrderStatus.CANCELLED);
                break;
            case IN_PROGRESS:
                valid = (next == WorkOrderStatus.ON_HOLD || next == WorkOrderStatus.COMPLETED || next == WorkOrderStatus.CANCELLED);
                break;
            case ON_HOLD:
                valid = (next == WorkOrderStatus.IN_PROGRESS || next == WorkOrderStatus.CANCELLED);
                break;
            case COMPLETED:
                valid = (next == WorkOrderStatus.CLOSED);
                break;
        }

        if (!valid) {
            throw new IllegalStateException("Illegal state transition from " + current + " to " + next);
        }
    }

    private LocalDateTime computeSlaDueDate(LocalDateTime start, Priority priority) {
        switch (priority) {
            case URGENT: return start.plusHours(4);
            case HIGH: return start.plusHours(24);
            case MEDIUM: return start.plusHours(48);
            case LOW: default: return start.plusHours(72);
        }
    }

    private void recordStatusHistory(WorkOrder wo, WorkOrderStatus from, WorkOrderStatus to, User user, String note) {
        WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
                .workOrder(wo)
                .fromStatus(from)
                .toStatus(to)
                .changedBy(user)
                .changedAt(LocalDateTime.now())
                .note(note)
                .build();
        historyRepository.save(history);
    }

    private WorkOrderDto mapToDto(WorkOrder wo) {
        return WorkOrderDto.builder()
                .id(wo.getId())
                .code(wo.getCode())
                .title(wo.getTitle())
                .description(wo.getDescription())
                .priority(wo.getPriority())
                .status(wo.getStatus())
                .slaDueAt(wo.getSlaDueAt())
                .createdAt(wo.getCreatedAt())
                .customerId(wo.getCustomer() != null ? wo.getCustomer().getId() : null)
                .customerName(wo.getCustomer() != null ? wo.getCustomer().getName() : null)
                .siteId(wo.getSite() != null ? wo.getSite().getId() : null)
                .siteName(wo.getSite() != null ? wo.getSite().getName() : null)
                .assignedToId(wo.getAssignedTo() != null ? wo.getAssignedTo().getId() : null)
                .assignedToName(wo.getAssignedTo() != null ? wo.getAssignedTo().getName() : null)
                .partsCost(wo.getPartsCost())
                .laborMinutes(wo.getLaborMinutes())
                .build();
    }
}
