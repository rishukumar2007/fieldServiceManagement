package com.KEYSTONE.fieldServiceManagement.Dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDto {
    private long totalWorkOrders;
    private long openWorkOrders;
    private long inProgressWorkOrders;
    private long completedWorkOrders;
    private long overdueWorkOrders;
    private double slaCompliancePercentage;
    private Map<String, Long> statusBreakdown;
}
