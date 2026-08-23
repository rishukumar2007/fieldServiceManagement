package com.KEYSTONE.fieldServiceManagement.Controller;

import com.KEYSTONE.fieldServiceManagement.Dto.*;
import com.KEYSTONE.fieldServiceManagement.Service.WorkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@CrossOrigin(origins = "*")
public class WorkOrderController {

    @Autowired
    private WorkOrderService workOrderService;

    @GetMapping
    public ResponseEntity<List<WorkOrderDto>> getAllWorkOrders() {
        return ResponseEntity.ok(workOrderService.getAllWorkOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    public ResponseEntity<WorkOrderDto> createWorkOrder(@RequestBody CreateWorkOrderRequest request) {
        return ResponseEntity.ok(workOrderService.createWorkOrder(request));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<WorkOrderDto> assignTechnician(
            @PathVariable Long id,
            @RequestBody AssignWorkOrderRequest request
    ) {
        return ResponseEntity.ok(workOrderService.assignTechnician(id, request.getTechnicianId(), request.getNote()));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<WorkOrderDto> transitionStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long actingUserId
    ) {
        return ResponseEntity.ok(workOrderService.transitionStatus(id, request.getStatus(), request.getNote(), actingUserId));
    }

    @PostMapping("/{id}/parts")
    public ResponseEntity<WorkOrderDto> logPartUsage(
            @PathVariable Long id,
            @RequestBody PartUsageRequest request
    ) {
        return ResponseEntity.ok(workOrderService.logPartUsage(id, request.getPartId(), request.getQuantity()));
    }

    @PostMapping("/{id}/time")
    public ResponseEntity<WorkOrderDto> logTimeSpent(
            @PathVariable Long id,
            @RequestBody TimeLogRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long technicianId
    ) {
        return ResponseEntity.ok(workOrderService.logTimeSpent(id, request.getMinutes(), request.getNote(), technicianId));
    }
}
