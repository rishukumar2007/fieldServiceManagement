package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.*;
import com.KEYSTONE.fieldServiceManagement.model.Priority;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/work-orders", "/work-orders"})
@CrossOrigin(origins = "*")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @Autowired
    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping
    public ResponseEntity<List<WorkOrderDto>> getAllWorkOrders(
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) Priority priority
    ) {
        return ResponseEntity.ok(workOrderService.getAllWorkOrders(status, priority));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(@PathVariable String id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    public ResponseEntity<WorkOrderDto> createWorkOrder(@Valid @RequestBody CreateWorkOrderRequest request) {
        WorkOrderDto created = workOrderService.createWorkOrder(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<WorkOrderDto> assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody AssignWorkOrderRequest request
    ) {
        return ResponseEntity.ok(workOrderService.assignWorkOrder(id, request));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<WorkOrderDto> transitionStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusTransitionRequest request
    ) {
        return ResponseEntity.ok(workOrderService.transitionStatus(id, request));
    }

    @PostMapping("/{id}/parts")
    public ResponseEntity<PartUsageDto> logPartUsage(
            @PathVariable String id,
            @Valid @RequestBody LogPartUsageRequest request
    ) {
        PartUsageDto logged = workOrderService.logPartUsage(id, request);
        return new ResponseEntity<>(logged, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/time")
    public ResponseEntity<TimeLogDto> logTimeSpent(
            @PathVariable String id,
            @Valid @RequestBody LogTimeRequest request
    ) {
        TimeLogDto logged = workOrderService.logTimeSpent(id, request);
        return new ResponseEntity<>(logged, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<WorkOrderStatusHistoryDto>> getWorkOrderHistory(@PathVariable String id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderHistory(id));
    }

    @GetMapping("/{id}/parts")
    public ResponseEntity<List<PartUsageDto>> getWorkOrderParts(@PathVariable String id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderParts(id));
    }

    @GetMapping("/{id}/time")
    public ResponseEntity<List<TimeLogDto>> getWorkOrderTimeLogs(@PathVariable String id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderTimeLogs(id));
    }
}
