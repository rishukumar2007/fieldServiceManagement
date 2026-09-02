package com.KEYSTONE.fieldServiceManagement.dto;

import java.util.Map;

public class DashboardSummaryDto {
    private long totalWorkOrders;
    private long openWorkOrders;
    private long inProgressWorkOrders;
    private long completedWorkOrders;
    private long overdueWorkOrders;
    private double slaCompliancePercentage;
    private Map<String, Long> statusBreakdown;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long totalWorkOrders, long openWorkOrders, long inProgressWorkOrders,
                               long completedWorkOrders, long overdueWorkOrders,
                               double slaCompliancePercentage, Map<String, Long> statusBreakdown) {
        this.totalWorkOrders = totalWorkOrders;
        this.openWorkOrders = openWorkOrders;
        this.inProgressWorkOrders = inProgressWorkOrders;
        this.completedWorkOrders = completedWorkOrders;
        this.overdueWorkOrders = overdueWorkOrders;
        this.slaCompliancePercentage = slaCompliancePercentage;
        this.statusBreakdown = statusBreakdown;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalWorkOrders;
        private long openWorkOrders;
        private long inProgressWorkOrders;
        private long completedWorkOrders;
        private long overdueWorkOrders;
        private double slaCompliancePercentage;
        private Map<String, Long> statusBreakdown;

        public Builder totalWorkOrders(long totalWorkOrders) { this.totalWorkOrders = totalWorkOrders; return this; }
        public Builder openWorkOrders(long openWorkOrders) { this.openWorkOrders = openWorkOrders; return this; }
        public Builder inProgressWorkOrders(long inProgressWorkOrders) { this.inProgressWorkOrders = inProgressWorkOrders; return this; }
        public Builder completedWorkOrders(long completedWorkOrders) { this.completedWorkOrders = completedWorkOrders; return this; }
        public Builder overdueWorkOrders(long overdueWorkOrders) { this.overdueWorkOrders = overdueWorkOrders; return this; }
        public Builder slaCompliancePercentage(double slaCompliancePercentage) { this.slaCompliancePercentage = slaCompliancePercentage; return this; }
        public Builder statusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; return this; }

        public DashboardSummaryDto build() {
            return new DashboardSummaryDto(totalWorkOrders, openWorkOrders, inProgressWorkOrders,
                    completedWorkOrders, overdueWorkOrders, slaCompliancePercentage, statusBreakdown);
        }
    }

    public long getTotalWorkOrders() { return totalWorkOrders; }
    public void setTotalWorkOrders(long totalWorkOrders) { this.totalWorkOrders = totalWorkOrders; }

    public long getOpenWorkOrders() { return openWorkOrders; }
    public void setOpenWorkOrders(long openWorkOrders) { this.openWorkOrders = openWorkOrders; }

    public long getInProgressWorkOrders() { return inProgressWorkOrders; }
    public void setInProgressWorkOrders(long inProgressWorkOrders) { this.inProgressWorkOrders = inProgressWorkOrders; }

    public long getCompletedWorkOrders() { return completedWorkOrders; }
    public void setCompletedWorkOrders(long completedWorkOrders) { this.completedWorkOrders = completedWorkOrders; }

    public long getOverdueWorkOrders() { return overdueWorkOrders; }
    public void setOverdueWorkOrders(long overdueWorkOrders) { this.overdueWorkOrders = overdueWorkOrders; }

    public double getSlaCompliancePercentage() { return slaCompliancePercentage; }
    public void setSlaCompliancePercentage(double slaCompliancePercentage) { this.slaCompliancePercentage = slaCompliancePercentage; }

    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }
}
