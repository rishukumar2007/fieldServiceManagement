package com.KEYSTONE.fieldServiceManagement.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_orders")
public class WorkOrder {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkOrderStatus status;

    @Column(name = "sla_due_at", nullable = false)
    private LocalDateTime slaDueAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Column(name = "parts_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal partsCost = BigDecimal.ZERO;

    @Column(name = "labor_minutes", nullable = false)
    private Integer laborMinutes = 0;

    public WorkOrder() {
    }

    public WorkOrder(String id, String code, String title, String description, Priority priority,
                     WorkOrderStatus status, LocalDateTime slaDueAt, LocalDateTime createdAt,
                     Customer customer, Site site, User assignedTo, BigDecimal partsCost, Integer laborMinutes) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.slaDueAt = slaDueAt;
        this.createdAt = createdAt;
        this.customer = customer;
        this.site = site;
        this.assignedTo = assignedTo;
        this.partsCost = partsCost != null ? partsCost : BigDecimal.ZERO;
        this.laborMinutes = laborMinutes != null ? laborMinutes : 0;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.partsCost == null) {
            this.partsCost = BigDecimal.ZERO;
        }
        if (this.laborMinutes == null) {
            this.laborMinutes = 0;
        }
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
        private Customer customer;
        private Site site;
        private User assignedTo;
        private BigDecimal partsCost = BigDecimal.ZERO;
        private Integer laborMinutes = 0;

        public Builder id(String id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder priority(Priority priority) { this.priority = priority; return this; }
        public Builder status(WorkOrderStatus status) { this.status = status; return this; }
        public Builder slaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder customer(Customer customer) { this.customer = customer; return this; }
        public Builder site(Site site) { this.site = site; return this; }
        public Builder assignedTo(User assignedTo) { this.assignedTo = assignedTo; return this; }
        public Builder partsCost(BigDecimal partsCost) { this.partsCost = partsCost; return this; }
        public Builder laborMinutes(Integer laborMinutes) { this.laborMinutes = laborMinutes; return this; }

        public WorkOrder build() {
            return new WorkOrder(id, code, title, description, priority, status, slaDueAt, createdAt,
                    customer, site, assignedTo, partsCost, laborMinutes);
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

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Site getSite() { return site; }
    public void setSite(Site site) { this.site = site; }

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public BigDecimal getPartsCost() { return partsCost; }
    public void setPartsCost(BigDecimal partsCost) { this.partsCost = partsCost; }

    public Integer getLaborMinutes() { return laborMinutes; }
    public void setLaborMinutes(Integer laborMinutes) { this.laborMinutes = laborMinutes; }
}
