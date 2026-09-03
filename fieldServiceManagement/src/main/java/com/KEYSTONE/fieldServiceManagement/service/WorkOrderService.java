package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.*;
import com.KEYSTONE.fieldServiceManagement.exception.InsufficientStockException;
import com.KEYSTONE.fieldServiceManagement.exception.InvalidStatusTransitionException;
import com.KEYSTONE.fieldServiceManagement.exception.ResourceNotFoundException;
import com.KEYSTONE.fieldServiceManagement.model.*;
import com.KEYSTONE.fieldServiceManagement.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final PartRepository partRepository;
    private final PartUsageRepository partUsageRepository;
    private final TimeLogRepository timeLogRepository;

    public WorkOrderService(WorkOrderRepository workOrderRepository,
                            WorkOrderStatusHistoryRepository historyRepository,
                            CustomerRepository customerRepository,
                            SiteRepository siteRepository,
                            UserRepository userRepository,
                            PartRepository partRepository,
                            PartUsageRepository partUsageRepository,
                            TimeLogRepository timeLogRepository) {
        this.workOrderRepository = workOrderRepository;
        this.historyRepository = historyRepository;
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.partRepository = partRepository;
        this.partUsageRepository = partUsageRepository;
        this.timeLogRepository = timeLogRepository;
    }

    public List<WorkOrderDto> getAllWorkOrders() {
        return workOrderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public WorkOrderDto getWorkOrderById(String id) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));
        return convertToDto(wo);
    }

    @Transactional
    public WorkOrderDto createWorkOrder(CreateWorkOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));
        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + request.getSiteId()));

        String code = "WO-" + (1000 + workOrderRepository.count() + 1);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime slaDueAt = computeSlaDueDate(request.getPriority(), now);

        WorkOrder wo = WorkOrder.builder()
                .id("wo-" + System.currentTimeMillis())
                .code(code)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(WorkOrderStatus.NEW)
                .slaDueAt(slaDueAt)
                .createdAt(now)
                .customer(customer)
                .site(site)
                .partsCost(0.0)
                .laborMinutes(0)
                .build();

        WorkOrder saved = workOrderRepository.save(wo);

        recordHistory(saved, null, WorkOrderStatus.NEW, "Work order created.");

        return convertToDto(saved);
    }

    @Transactional
    public WorkOrderDto assignWorkOrder(String id, AssignWorkOrderRequest request) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));
        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + request.getTechnicianId()));

        WorkOrderStatus fromStatus = wo.getStatus();
        wo.setAssignedTo(technician);
        if (wo.getStatus() == WorkOrderStatus.NEW) {
            wo.setStatus(WorkOrderStatus.ASSIGNED);
        }

        WorkOrder updated = workOrderRepository.save(wo);
        recordHistory(updated, fromStatus, updated.getStatus(), request.getNote() != null ? request.getNote() : "Assigned to " + technician.getName());

        return convertToDto(updated);
    }

    @Transactional
    public WorkOrderDto transitionStatus(String id, StatusTransitionRequest request) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));

        WorkOrderStatus current = wo.getStatus();
        WorkOrderStatus target = request.getTargetStatus();

        validateTransition(current, target);

        wo.setStatus(target);
        WorkOrder updated = workOrderRepository.save(wo);

        recordHistory(updated, current, target, request.getNote());

        return convertToDto(updated);
    }

    @Transactional
    public PartUsageDto logPartUsage(String workOrderId, LogPartUsageRequest request) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));
        Part part = partRepository.findById(request.getPartId())
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with ID: " + request.getPartId()));

        if (part.getStockQty() < request.getQtyUsed()) {
            throw new InsufficientStockException("Insufficient stock for part: " + part.getName() + ". Available: " + part.getStockQty());
        }

        part.setStockQty(part.getStockQty() - request.getQtyUsed());
        partRepository.save(part);

        double totalCost = part.getUnitCost() * request.getQtyUsed();
        PartUsage usage = PartUsage.builder()
                .id("pu-" + System.currentTimeMillis())
                .workOrder(wo)
                .part(part)
                .partName(part.getName())
                .unitCost(part.getUnitCost())
                .qtyUsed(request.getQtyUsed())
                .totalCost(totalCost)
                .loggedAt(LocalDateTime.now())
                .build();

        PartUsage saved = partUsageRepository.save(usage);

        wo.setPartsCost((wo.getPartsCost() != null ? wo.getPartsCost() : 0.0) + totalCost);
        workOrderRepository.save(wo);

        return PartUsageDto.builder()
                .id(saved.getId())
                .workOrderId(wo.getId())
                .partId(part.getId())
                .partName(saved.getPartName())
                .unitCost(saved.getUnitCost())
                .qtyUsed(saved.getQtyUsed())
                .totalCost(saved.getTotalCost())
                .loggedAt(saved.getLoggedAt())
                .build();
    }

    @Transactional
    public TimeLogDto logTime(String workOrderId, LogTimeRequest request) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        User currentUser = getCurrentAuthenticatedUser();

        TimeLog log = TimeLog.builder()
                .id("tl-" + System.currentTimeMillis())
                .workOrder(wo)
                .technician(currentUser)
                .minutes(request.getMinutes())
                .note(request.getNote())
                .createdAt(LocalDateTime.now())
                .build();

        TimeLog saved = timeLogRepository.save(log);

        wo.setLaborMinutes((wo.getLaborMinutes() != null ? wo.getLaborMinutes() : 0) + request.getMinutes());
        workOrderRepository.save(wo);

        return TimeLogDto.builder()
                .id(saved.getId())
                .workOrderId(wo.getId())
                .technicianId(currentUser != null ? currentUser.getId() : null)
                .technicianName(currentUser != null ? currentUser.getName() : "System")
                .minutes(saved.getMinutes())
                .note(saved.getNote())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private void validateTransition(WorkOrderStatus current, WorkOrderStatus target) {
        if (current == WorkOrderStatus.CLOSED || current == WorkOrderStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Terminal state " + current + " cannot transition to any other status.");
        }
        if (current == target) return;

        boolean valid = switch (current) {
            case NEW -> target == WorkOrderStatus.ASSIGNED || target == WorkOrderStatus.CANCELLED;
            case ASSIGNED -> target == WorkOrderStatus.IN_PROGRESS || target == WorkOrderStatus.CANCELLED;
            case IN_PROGRESS -> target == WorkOrderStatus.ON_HOLD || target == WorkOrderStatus.COMPLETED || target == WorkOrderStatus.CANCELLED;
            case ON_HOLD -> target == WorkOrderStatus.IN_PROGRESS || target == WorkOrderStatus.CANCELLED;
            case COMPLETED -> target == WorkOrderStatus.CLOSED;
            default -> false;
        };

        if (!valid) {
            throw new InvalidStatusTransitionException("Illegal status transition from " + current + " to " + target);
        }
    }

    private void recordHistory(WorkOrder wo, WorkOrderStatus from, WorkOrderStatus to, String note) {
        User user = getCurrentAuthenticatedUser();
        WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
                .id("wosh-" + System.currentTimeMillis())
                .workOrder(wo)
                .fromStatus(from)
                .toStatus(to)
                .changedByUser(user)
                .changedAt(LocalDateTime.now())
                .note(note)
                .build();
        historyRepository.save(history);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    private LocalDateTime computeSlaDueDate(Priority priority, LocalDateTime from) {
        int hours = switch (priority) {
            case URGENT -> 4;
            case HIGH -> 24;
            case MEDIUM -> 48;
            case LOW -> 72;
        };
        return from.plusHours(hours);
    }

    private WorkOrderDto convertToDto(WorkOrder wo) {
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
                .partsCost(wo.getPartsCost() != null ? wo.getPartsCost() : 0.0)
                .laborMinutes(wo.getLaborMinutes() != null ? wo.getLaborMinutes() : 0)
                .build();
    }
}
