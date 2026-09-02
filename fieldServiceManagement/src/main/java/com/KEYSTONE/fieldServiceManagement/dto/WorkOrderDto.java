package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Priority;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrder;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private BigDecimal partsCost;
    private Integer laborMinutes;

    public WorkOrderDto() {
    }

    public WorkOrderDto(String id, String code, String title, String description, Priority priority,
                        WorkOrderStatus status, LocalDateTime slaDueAt, LocalDateTime createdAt,
                        String customerId, String customerName, String siteId, String siteName,
                        String assignedToId, String assignedToName, BigDecimal partsCost, Integer laborMinutes) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.slaDueAt = slaDueAt;
        this.createdAt = createdAt;
        this.customerId = customerId;
        this.customerName = customerName;
        this.siteId = siteId;
        this.siteName = siteName;
        this.assignedToId = assignedToId;
        this.assignedToName = assignedToName;
        this.partsCost = partsCost;
        this.laborMinutes = laborMinutes;
    }

    public static WorkOrderDto fromEntity(WorkOrder wo) {
        if (wo == null) return null;
        return builder()
                .id(wo.getId())
                .code(wo.getCode())
                .title(wo.getTitle())
                .description(wo.getDescription())
                .priority(wo.getPriority())
                .status(wo.getStatus())
                .slaDueAt(wo.getSlaDueAt())
                .createdAt(wo.getCreatedAt())
                .customerId(wo.getCustomer() != null ? wo.getCustomer().getId() : null)
                .customerName(wo.getCustomer() != null ? wo.getCustomer().getName() : null)
                .siteId(wo.getSite() != null ? wo.getSite().getId() : null)
                .siteName(wo.getSite() != null ? wo.getSite().getName() : null)
                .assignedToId(wo.getAssignedTo() != null ? wo.getAssignedTo().getId() : null)
                .assignedToName(wo.getAssignedTo() != null ? wo.getAssignedTo().getName() : "Unassigned")
                .partsCost(wo.getPartsCost())
                .laborMinutes(wo.getLaborMinutes())
                .build();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
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
        private BigDecimal partsCost;
        private Integer laborMinutes;

        public Builder id(String id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder priority(Priority priority) { this.priority = priority; return this; }
        public Builder status(WorkOrderStatus status) { this.status = status; return this; }
        public Builder slaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder customerId(String customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder siteId(String siteId) { this.siteId = siteId; return this; }
        public Builder siteName(String siteName) { this.siteName = siteName; return this; }
        public Builder assignedToId(String assignedToId) { this.assignedToId = assignedToId; return this; }
        public Builder assignedToName(String assignedToName) { this.assignedToName = assignedToName; return this; }
        public Builder partsCost(BigDecimal partsCost) { this.partsCost = partsCost; return this; }
        public Builder laborMinutes(Integer laborMinutes) { this.laborMinutes = laborMinutes; return this; }

        public WorkOrderDto build() {
            return new WorkOrderDto(id, code, title, description, priority, status, slaDueAt, createdAt,
                    customerId, customerName, siteId, siteName, assignedToId, assignedToName, partsCost, laborMinutes);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public WorkOrderStatus getStatus() { return status; }
    public void setStatus(WorkOrderStatus status) { this.status = status; }

    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public void setSlaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getSiteId() { return siteId; }
    public void setSiteId(String siteId) { this.siteId = siteId; }

    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }

    public String getAssignedToId() { return assignedToId; }
    public void setAssignedToId(String assignedToId) { this.assignedToId = assignedToId; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public BigDecimal getPartsCost() { return partsCost; }
    public void setPartsCost(BigDecimal partsCost) { this.partsCost = partsCost; }

    public Integer getLaborMinutes() { return laborMinutes; }
    public void setLaborMinutes(Integer laborMinutes) { this.laborMinutes = laborMinutes; }
}
