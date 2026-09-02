package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.*;
import com.KEYSTONE.fieldServiceManagement.exception.InsufficientStockException;
import com.KEYSTONE.fieldServiceManagement.exception.InvalidStatusTransitionException;
import com.KEYSTONE.fieldServiceManagement.exception.ResourceNotFoundException;
import com.KEYSTONE.fieldServiceManagement.exception.UnauthorizedActionException;
import com.KEYSTONE.fieldServiceManagement.model.*;
import com.KEYSTONE.fieldServiceManagement.repository.*;
import com.KEYSTONE.fieldServiceManagement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;
    private final PartRepository partRepository;
    private final PartUsageRepository partUsageRepository;
    private final TimeLogRepository timeLogRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public WorkOrderService(WorkOrderRepository workOrderRepository,
                            CustomerRepository customerRepository,
                            SiteRepository siteRepository,
                            UserRepository userRepository,
                            WorkOrderStatusHistoryRepository historyRepository,
                            PartRepository partRepository,
                            PartUsageRepository partUsageRepository,
                            TimeLogRepository timeLogRepository,
                            NotificationRepository notificationRepository) {
        this.workOrderRepository = workOrderRepository;
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.partRepository = partRepository;
        this.partUsageRepository = partUsageRepository;
        this.timeLogRepository = timeLogRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<WorkOrderDto> getAllWorkOrders(WorkOrderStatus status, Priority priority) {
        List<WorkOrder> list;
        if (status != null && priority != null) {
            list = workOrderRepository.findByStatusAndPriority(status, priority);
        } else if (status != null) {
            list = workOrderRepository.findByStatus(status);
        } else if (priority != null) {
            list = workOrderRepository.findByPriority(priority);
        } else {
            list = workOrderRepository.findAll();
        }

        return list.stream()
                .map(WorkOrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WorkOrderDto> getAllWorkOrders() {
        return getAllWorkOrders(null, null);
    }

    @Transactional(readOnly = true)
    public WorkOrderDto getWorkOrderById(String id) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder not found with ID: " + id));
        return WorkOrderDto.fromEntity(wo);
    }

    @Transactional
    public WorkOrderDto createWorkOrder(CreateWorkOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + request.getSiteId()));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime slaDueAt = computeSlaDueDate(now, request.getPriority());
        String code = "WO-" + (1000 + new Random().nextInt(9000));
        String id = code;

        WorkOrder workOrder = WorkOrder.builder()
                .id(id)
                .code(code)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(WorkOrderStatus.NEW)
                .createdAt(now)
                .slaDueAt(slaDueAt)
                .customer(customer)
                .site(site)
                .partsCost(BigDecimal.ZERO)
                .laborMinutes(0)
                .build();

        WorkOrder saved = workOrderRepository.save(workOrder);

        User currentUser = getCurrentUserOrFallback();
        recordStatusHistory(saved, null, WorkOrderStatus.NEW, currentUser, "Work order raised");

        // Create notification
        NotificationItem notif = NotificationItem.builder()
                .id("notif-" + UUID.randomUUID().toString().substring(0, 8))
                .title("New Work Order Created")
                .message(saved.getCode() + " raised for " + customer.getName() + " (" + site.getName() + ")")
                .type(NotificationType.STATUS_CHANGE)
                .timestamp(now)
                .read(false)
                .workOrderId(saved.getId())
                .build();
        notificationRepository.save(notif);

        return WorkOrderDto.fromEntity(saved);
    }

    @Transactional
    public WorkOrderDto assignWorkOrder(String workOrderId, AssignWorkOrderRequest request) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId));

        User tech = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + request.getTechnicianId()));

        if (tech.getRole() != Role.TECHNICIAN) {
            throw new IllegalArgumentException("User " + tech.getName() + " is not a TECHNICIAN");
        }

        WorkOrderStatus prevStatus = wo.getStatus();
        if (prevStatus != WorkOrderStatus.NEW && prevStatus != WorkOrderStatus.ASSIGNED) {
            throw new InvalidStatusTransitionException("Cannot reassign work order in status: " + prevStatus);
        }

        wo.setAssignedTo(tech);
        wo.setStatus(WorkOrderStatus.ASSIGNED);

        WorkOrder updated = workOrderRepository.save(wo);
        User actingUser = getCurrentUserOrFallback();
        String note = request.getNote() != null ? request.getNote() : "Assigned to technician " + tech.getName();
        recordStatusHistory(updated, prevStatus, WorkOrderStatus.ASSIGNED, actingUser, note);

        // Assignment Notification
        NotificationItem notif = NotificationItem.builder()
                .id("notif-" + UUID.randomUUID().toString().substring(0, 8))
                .title("Job Assigned")
                .message(wo.getCode() + " assigned to " + tech.getName())
                .type(NotificationType.ASSIGNMENT)
                .timestamp(LocalDateTime.now())
                .read(false)
                .workOrderId(wo.getId())
                .build();
        notificationRepository.save(notif);

        return WorkOrderDto.fromEntity(updated);
    }

    @Transactional
    public WorkOrderDto transitionStatus(String workOrderId, StatusTransitionRequest request) {
        return transitionStatus(workOrderId, request.getStatus(), request.getNote());
    }

    @Transactional
    public WorkOrderDto transitionStatus(String workOrderId, StatusUpdateRequest request) {
        return transitionStatus(workOrderId, request.getStatus(), request.getNote());
    }

    @Transactional
    public WorkOrderDto transitionStatus(String workOrderId, WorkOrderStatus nextStatus, String note) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId));

        WorkOrderStatus currentStatus = wo.getStatus();
        validateTransition(currentStatus, nextStatus);

        User actingUser = getCurrentUserOrFallback();

        // RBAC validation: Only MANAGER can close jobs
        if (nextStatus == WorkOrderStatus.CLOSED && actingUser != null && actingUser.getRole() != Role.MANAGER) {
            throw new UnauthorizedActionException("Only a Manager can close a work order");
        }

        wo.setStatus(nextStatus);
        WorkOrder updated = workOrderRepository.save(wo);

        recordStatusHistory(updated, currentStatus, nextStatus, actingUser, note != null ? note : "Status transitioned to " + nextStatus);

        return WorkOrderDto.fromEntity(updated);
    }

    @Transactional
    public PartUsageDto logPartUsage(String workOrderId, LogPartUsageRequest request) {
        return logPartUsageInternal(workOrderId, request.getPartId(), request.getQuantity());
    }

    @Transactional
    public PartUsageDto logPartUsage(String workOrderId, PartUsageRequest request) {
        return logPartUsageInternal(workOrderId, request.getPartId(), request.getQuantity());
    }

    private PartUsageDto logPartUsageInternal(String workOrderId, String partId, Integer quantity) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId));

        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with ID: " + partId));

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        if (part.getStockQty() < quantity) {
            throw new InsufficientStockException("Insufficient stock for part: " + part.getName() + ". Available: " + part.getStockQty() + ", Requested: " + quantity);
        }

        // Decrement stock
        part.setStockQty(part.getStockQty() - quantity);
        partRepository.save(part);

        BigDecimal totalCost = part.getUnitCost().multiply(BigDecimal.valueOf(quantity));

        String id = "pu-" + UUID.randomUUID().toString().substring(0, 8);
        PartUsage usage = PartUsage.builder()
                .id(id)
                .workOrder(wo)
                .part(part)
                .partName(part.getName())
                .unitCost(part.getUnitCost())
                .qtyUsed(quantity)
                .totalCost(totalCost)
                .loggedAt(LocalDateTime.now())
                .build();
        PartUsage savedUsage = partUsageRepository.save(usage);

        // Roll up work order parts cost
        wo.setPartsCost(wo.getPartsCost().add(totalCost));
        workOrderRepository.save(wo);

        return PartUsageDto.fromEntity(savedUsage);
    }

    @Transactional
    public TimeLogDto logTimeSpent(String workOrderId, LogTimeRequest request) {
        return logTimeSpentInternal(workOrderId, request.getMinutes(), request.getNote());
    }

    @Transactional
    public TimeLogDto logTimeSpent(String workOrderId, TimeLogRequest request) {
        return logTimeSpentInternal(workOrderId, request.getMinutes(), request.getNote());
    }

    private TimeLogDto logTimeSpentInternal(String workOrderId, Integer minutes, String note) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId));

        if (minutes == null || minutes <= 0) {
            throw new IllegalArgumentException("Minutes must be greater than 0");
        }

        User technician = getCurrentUserOrFallback();
        if (technician == null && wo.getAssignedTo() != null) {
            technician = wo.getAssignedTo();
        }

        String id = "tl-" + UUID.randomUUID().toString().substring(0, 8);
        TimeLog timeLog = TimeLog.builder()
                .id(id)
                .workOrder(wo)
                .technician(technician)
                .minutes(minutes)
                .note(note)
                .createdAt(LocalDateTime.now())
                .build();
        TimeLog savedTimeLog = timeLogRepository.save(timeLog);

        wo.setLaborMinutes(wo.getLaborMinutes() + minutes);
        workOrderRepository.save(wo);

        return TimeLogDto.fromEntity(savedTimeLog);
    }

    @Transactional(readOnly = true)
    public List<WorkOrderStatusHistoryDto> getWorkOrderHistory(String workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId);
        }
        return historyRepository.findByWorkOrderIdOrderByChangedAtAsc(workOrderId).stream()
                .map(WorkOrderStatusHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PartUsageDto> getWorkOrderParts(String workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId);
        }
        return partUsageRepository.findByWorkOrderId(workOrderId).stream()
                .map(PartUsageDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TimeLogDto> getWorkOrderTimeLogs(String workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("WorkOrder not found with ID: " + workOrderId);
        }
        return timeLogRepository.findByWorkOrderId(workOrderId).stream()
                .map(TimeLogDto::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateTransition(WorkOrderStatus current, WorkOrderStatus next) {
        if (current == next) return;

        if (current == WorkOrderStatus.CLOSED || current == WorkOrderStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Terminal state! Cannot transition out of " + current);
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
            throw new InvalidStatusTransitionException("Illegal state transition from " + current + " to " + next);
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
        String id = "hist-" + UUID.randomUUID().toString().substring(0, 8);
        WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
                .id(id)
                .workOrder(wo)
                .fromStatus(from)
                .toStatus(to)
                .changedByUser(user)
                .changedAt(LocalDateTime.now())
                .note(note)
                .build();
        historyRepository.save(history);
    }

    private User getCurrentUserOrFallback() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        } else if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return userRepository.findByEmailIgnoreCase(auth.getName()).orElse(null);
        }
        return userRepository.findAll().stream().findFirst().orElse(null);
    }
}
