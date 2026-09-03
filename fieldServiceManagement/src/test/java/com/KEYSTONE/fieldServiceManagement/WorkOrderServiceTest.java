package com.KEYSTONE.fieldServiceManagement;

import com.KEYSTONE.fieldServiceManagement.dto.*;
import com.KEYSTONE.fieldServiceManagement.exception.InsufficientStockException;
import com.KEYSTONE.fieldServiceManagement.exception.InvalidStatusTransitionException;
import com.KEYSTONE.fieldServiceManagement.model.Priority;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.service.PartService;
import com.KEYSTONE.fieldServiceManagement.service.WorkOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class WorkOrderServiceTest {

    @Autowired
    private WorkOrderService workOrderService;

    @Autowired
    private PartService partService;

    @Autowired
    private UserDetailsService userDetailsService;

    @BeforeEach
    void setUp() {
        // Authenticate as Manager by default for test context
        UserDetails userDetails = userDetailsService.loadUserByUsername("john.m@meridian.com");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void testCreateWorkOrder() {
        CreateWorkOrderRequest request = new CreateWorkOrderRequest(
                "Test HVAC Malfunction",
                "Compressor making rattling noise",
                Priority.HIGH,
                "cust-1",
                "site-1"
        );

        WorkOrderDto created = workOrderService.createWorkOrder(request);

        assertNotNull(created.getId());
        assertEquals("Test HVAC Malfunction", created.getTitle());
        assertEquals(WorkOrderStatus.NEW, created.getStatus());
        assertEquals(Priority.HIGH, created.getPriority());
        assertNotNull(created.getSlaDueAt());
    }

    @Test
    void testAssignWorkOrder() {
        AssignWorkOrderRequest request = new AssignWorkOrderRequest("usr-3", "Assigned to HVAC specialist");
        WorkOrderDto assigned = workOrderService.assignWorkOrder("WO-1004", request);

        assertEquals(WorkOrderStatus.ASSIGNED, assigned.getStatus());
        assertEquals("usr-3", assigned.getAssignedToId());
    }

    @Test
    void testStateTransitions() {
        // WO-1002 starts at ASSIGNED
        // Transition ASSIGNED -> IN_PROGRESS
        StatusTransitionRequest toProgress = new StatusTransitionRequest(WorkOrderStatus.IN_PROGRESS, "Started diagnosis");
        WorkOrderDto inProgress = workOrderService.transitionStatus("WO-1002", toProgress);
        assertEquals(WorkOrderStatus.IN_PROGRESS, inProgress.getStatus());

        // Transition IN_PROGRESS -> COMPLETED
        StatusTransitionRequest toCompleted = new StatusTransitionRequest(WorkOrderStatus.COMPLETED, "Repair finished");
        WorkOrderDto completed = workOrderService.transitionStatus("WO-1002", toCompleted);
        assertEquals(WorkOrderStatus.COMPLETED, completed.getStatus());

        // Transition COMPLETED -> CLOSED (Manager role)
        StatusTransitionRequest toClosed = new StatusTransitionRequest(WorkOrderStatus.CLOSED, "Manager approved and closed");
        WorkOrderDto closed = workOrderService.transitionStatus("WO-1002", toClosed);
        assertEquals(WorkOrderStatus.CLOSED, closed.getStatus());

        // Attempt invalid transition from terminal CLOSED state
        assertThrows(InvalidStatusTransitionException.class, () -> {
            workOrderService.transitionStatus("WO-1002", new StatusTransitionRequest(WorkOrderStatus.IN_PROGRESS, "Invalid"));
        });
    }

    @Test
    void testTransactionalPartUsage() {
        PartDto initialPart = partService.getPartById("part-1");
        int initialStock = initialPart.getStockQty();

        LogPartUsageRequest request = new LogPartUsageRequest("part-1", 3);
        PartUsageDto usage = workOrderService.logPartUsage("WO-1001", request);

        assertNotNull(usage.getId());
        assertEquals(3, usage.getQtyUsed());

        PartDto updatedPart = partService.getPartById("part-1");
        assertEquals(initialStock - 3, updatedPart.getStockQty());
    }

    @Test
    void testInsufficientStockThrowsException() {
        LogPartUsageRequest request = new LogPartUsageRequest("part-5", 999);
        assertThrows(InsufficientStockException.class, () -> {
            workOrderService.logPartUsage("WO-1001", request);
        });
    }
}
