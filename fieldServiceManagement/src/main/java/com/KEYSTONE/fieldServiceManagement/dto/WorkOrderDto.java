package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Priority;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDto {
    private String id;
    private String code;
    private String title;
    private String description;
    private Priority priority;
    private WorkOrderStatus status;
    private LocalDateTime slaDueAt;
    private LocalDateTime createdAt;
    private String customerId;
    private String customerName;
    private String siteId;
    private String siteName;
    private String assignedToId;
    private String assignedToName;
    private Double partsCost;
    private Integer laborMinutes;
}
