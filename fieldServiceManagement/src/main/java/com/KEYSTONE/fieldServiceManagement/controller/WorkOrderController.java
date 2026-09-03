package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.*;
import com.KEYSTONE.fieldServiceManagement.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping
    public ResponseEntity<List<WorkOrderDto>> getAllWorkOrders() {
        return ResponseEntity.ok(workOrderService.getAllWorkOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(@PathVariable String id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER', 'CUSTOMER')")
    public ResponseEntity<WorkOrderDto> createWorkOrder(@Valid @RequestBody CreateWorkOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workOrderService.createWorkOrder(request));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<WorkOrderDto> assignWorkOrder(@PathVariable String id, @Valid @RequestBody AssignWorkOrderRequest request) {
        return ResponseEntity.ok(workOrderService.assignWorkOrder(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<WorkOrderDto> transitionStatus(@PathVariable String id, @Valid @RequestBody StatusTransitionRequest request) {
        return ResponseEntity.ok(workOrderService.transitionStatus(id, request));
    }

    @PostMapping("/{id}/parts")
    public ResponseEntity<PartUsageDto> logPartUsage(@PathVariable String id, @Valid @RequestBody LogPartUsageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workOrderService.logPartUsage(id, request));
    }

    @PostMapping("/{id}/time")
    public ResponseEntity<TimeLogDto> logTime(@PathVariable String id, @Valid @RequestBody LogTimeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workOrderService.logTime(id, request));
    }
}
