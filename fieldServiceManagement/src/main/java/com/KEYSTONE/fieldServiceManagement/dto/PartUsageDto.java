package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.PartUsage;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PartUsageDto {
    private String id;
    private String workOrderId;
    private String partId;
    private String partName;
    private BigDecimal unitCost;
    private Integer qtyUsed;
    private BigDecimal totalCost;
    private LocalDateTime loggedAt;

    public PartUsageDto() {
    }

    public PartUsageDto(String id, String workOrderId, String partId, String partName,
                        BigDecimal unitCost, Integer qtyUsed, BigDecimal totalCost, LocalDateTime loggedAt) {
        this.id = id;
        this.workOrderId = workOrderId;
        this.partId = partId;
        this.partName = partName;
        this.unitCost = unitCost;
        this.qtyUsed = qtyUsed;
        this.totalCost = totalCost;
        this.loggedAt = loggedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String workOrderId;
        private String partId;
        private String partName;
        private BigDecimal unitCost;
        private Integer qtyUsed;
        private BigDecimal totalCost;
        private LocalDateTime loggedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder workOrderId(String workOrderId) { this.workOrderId = workOrderId; return this; }
        public Builder partId(String partId) { this.partId = partId; return this; }
        public Builder partName(String partName) { this.partName = partName; return this; }
        public Builder unitCost(BigDecimal unitCost) { this.unitCost = unitCost; return this; }
        public Builder qtyUsed(Integer qtyUsed) { this.qtyUsed = qtyUsed; return this; }
        public Builder totalCost(BigDecimal totalCost) { this.totalCost = totalCost; return this; }
        public Builder loggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; return this; }

        public PartUsageDto build() {
            return new PartUsageDto(id, workOrderId, partId, partName, unitCost, qtyUsed, totalCost, loggedAt);
        }
    }

    public static PartUsageDto fromEntity(PartUsage usage) {
        if (usage == null) return null;
        return PartUsageDto.builder()
                .id(usage.getId())
                .workOrderId(usage.getWorkOrder() != null ? usage.getWorkOrder().getId() : null)
                .partId(usage.getPart() != null ? usage.getPart().getId() : null)
                .partName(usage.getPartName())
                .unitCost(usage.getUnitCost())
                .qtyUsed(usage.getQtyUsed())
                .totalCost(usage.getTotalCost())
                .loggedAt(usage.getLoggedAt())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(String workOrderId) { this.workOrderId = workOrderId; }

    public String getPartId() { return partId; }
    public void setPartId(String partId) { this.partId = partId; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public Integer getQtyUsed() { return qtyUsed; }
    public void setQtyUsed(Integer qtyUsed) { this.qtyUsed = qtyUsed; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public LocalDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; }
}
