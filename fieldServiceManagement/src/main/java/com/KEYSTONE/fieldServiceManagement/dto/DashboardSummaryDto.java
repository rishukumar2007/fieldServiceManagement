package com.KEYSTONE.fieldServiceManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private long totalWorkOrders;
    private long openWorkOrders;
    private long inProgressWorkOrders;
    private long completedWorkOrders;
    private long overdueWorkOrders;
    private double slaCompliancePercentage;
}
