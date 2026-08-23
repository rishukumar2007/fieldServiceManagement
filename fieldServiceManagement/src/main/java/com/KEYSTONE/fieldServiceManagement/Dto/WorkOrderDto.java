package com.KEYSTONE.fieldServiceManagement.Dto;

import com.KEYSTONE.fieldServiceManagement.Enum.Priority;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Priority priority;
    private WorkOrderStatus status;
    private LocalDateTime slaDueAt;
    private LocalDateTime createdAt;
    private Long customerId;
    private String customerName;
    private Long siteId;
    private String siteName;
    private Long assignedToId;
    private String assignedToName;
    private Double partsCost;
    private Integer laborMinutes;
}
