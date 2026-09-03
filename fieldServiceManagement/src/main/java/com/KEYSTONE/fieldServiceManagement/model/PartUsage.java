package com.KEYSTONE.fieldServiceManagement.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "part_usages")
public class PartUsage {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;

    @Column(name = "part_name", nullable = false)
    private String partName;

    @Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "qty_used", nullable = false)
    private Integer qtyUsed;

    @Column(name = "total_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "logged_at", nullable = false)
    private LocalDateTime loggedAt;

    public PartUsage() {
    }

    public PartUsage(String id, WorkOrder workOrder, Part part, String partName,
                     BigDecimal unitCost, Integer qtyUsed, BigDecimal totalCost, LocalDateTime loggedAt) {
        this.id = id;
        this.workOrder = workOrder;
        this.part = part;
        this.partName = partName;
        this.unitCost = unitCost;
        this.qtyUsed = qtyUsed;
        this.totalCost = totalCost;
        this.loggedAt = loggedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.loggedAt == null) {
            this.loggedAt = LocalDateTime.now();
        }
        if (this.totalCost == null && this.unitCost != null && this.qtyUsed != null) {
            this.totalCost = this.unitCost.multiply(BigDecimal.valueOf(this.qtyUsed));
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private WorkOrder workOrder;
        private Part part;
        private String partName;
        private BigDecimal unitCost;
        private Integer qtyUsed;
        private BigDecimal totalCost;
        private LocalDateTime loggedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder workOrder(WorkOrder workOrder) { this.workOrder = workOrder; return this; }
        public Builder part(Part part) { this.part = part; return this; }
        public Builder partName(String partName) { this.partName = partName; return this; }
        public Builder unitCost(BigDecimal unitCost) { this.unitCost = unitCost; return this; }
        public Builder qtyUsed(Integer qtyUsed) { this.qtyUsed = qtyUsed; return this; }
        public Builder totalCost(BigDecimal totalCost) { this.totalCost = totalCost; return this; }
        public Builder loggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; return this; }

        public PartUsage build() {
            return new PartUsage(id, workOrder, part, partName, unitCost, qtyUsed, totalCost, loggedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public WorkOrder getWorkOrder() { return workOrder; }
    public void setWorkOrder(WorkOrder workOrder) { this.workOrder = workOrder; }

    public Part getPart() { return part; }
    public void setPart(Part part) { this.part = part; }

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
