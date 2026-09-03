package com.KEYSTONE.fieldServiceManagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_order_status_history")
public class WorkOrderStatusHistory {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private WorkOrderStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false)
    private WorkOrderStatus toStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "changed_by_user_id", nullable = false)
    private User changedByUser;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @Column(length = 1024)
    private String note;

    public WorkOrderStatusHistory() {
    }

    public WorkOrderStatusHistory(String id, WorkOrder workOrder, WorkOrderStatus fromStatus,
                                  WorkOrderStatus toStatus, User changedByUser, LocalDateTime changedAt, String note) {
        this.id = id;
        this.workOrder = workOrder;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedByUser = changedByUser;
        this.changedAt = changedAt;
        this.note = note;
    }

    @PrePersist
    protected void onCreate() {
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private WorkOrder workOrder;
        private WorkOrderStatus fromStatus;
        private WorkOrderStatus toStatus;
        private User changedByUser;
        private LocalDateTime changedAt;
        private String note;

        public Builder id(String id) { this.id = id; return this; }
        public Builder workOrder(WorkOrder workOrder) { this.workOrder = workOrder; return this; }
        public Builder fromStatus(WorkOrderStatus fromStatus) { this.fromStatus = fromStatus; return this; }
        public Builder toStatus(WorkOrderStatus toStatus) { this.toStatus = toStatus; return this; }
        public Builder changedByUser(User changedByUser) { this.changedByUser = changedByUser; return this; }
        public Builder changedAt(LocalDateTime changedAt) { this.changedAt = changedAt; return this; }
        public Builder note(String note) { this.note = note; return this; }

        public WorkOrderStatusHistory build() {
            return new WorkOrderStatusHistory(id, workOrder, fromStatus, toStatus, changedByUser, changedAt, note);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public WorkOrder getWorkOrder() { return workOrder; }
    public void setWorkOrder(WorkOrder workOrder) { this.workOrder = workOrder; }

    public WorkOrderStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(WorkOrderStatus fromStatus) { this.fromStatus = fromStatus; }

    public WorkOrderStatus getToStatus() { return toStatus; }
    public void setToStatus(WorkOrderStatus toStatus) { this.toStatus = toStatus; }

    public User getChangedByUser() { return changedByUser; }
    public void setChangedByUser(User changedByUser) { this.changedByUser = changedByUser; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
