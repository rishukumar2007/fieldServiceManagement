package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatusHistory;
import java.time.LocalDateTime;

public class WorkOrderStatusHistoryDto {
    private String id;
    private String workOrderId;
    private WorkOrderStatus fromStatus;
    private WorkOrderStatus toStatus;
    private String changedByUserId;
    private String changedByUserName;
    private LocalDateTime changedAt;
    private String note;

    public WorkOrderStatusHistoryDto() {
    }

    public WorkOrderStatusHistoryDto(String id, String workOrderId, WorkOrderStatus fromStatus,
                                     WorkOrderStatus toStatus, String changedByUserId, String changedByUserName,
                                     LocalDateTime changedAt, String note) {
        this.id = id;
        this.workOrderId = workOrderId;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedByUserId = changedByUserId;
        this.changedByUserName = changedByUserName;
        this.changedAt = changedAt;
        this.note = note;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String workOrderId;
        private WorkOrderStatus fromStatus;
        private WorkOrderStatus toStatus;
        private String changedByUserId;
        private String changedByUserName;
        private LocalDateTime changedAt;
        private String note;

        public Builder id(String id) { this.id = id; return this; }
        public Builder workOrderId(String workOrderId) { this.workOrderId = workOrderId; return this; }
        public Builder fromStatus(WorkOrderStatus fromStatus) { this.fromStatus = fromStatus; return this; }
        public Builder toStatus(WorkOrderStatus toStatus) { this.toStatus = toStatus; return this; }
        public Builder changedByUserId(String changedByUserId) { this.changedByUserId = changedByUserId; return this; }
        public Builder changedByUserName(String changedByUserName) { this.changedByUserName = changedByUserName; return this; }
        public Builder changedAt(LocalDateTime changedAt) { this.changedAt = changedAt; return this; }
        public Builder note(String note) { this.note = note; return this; }

        public WorkOrderStatusHistoryDto build() {
            return new WorkOrderStatusHistoryDto(id, workOrderId, fromStatus, toStatus, changedByUserId, changedByUserName, changedAt, note);
        }
    }

    public static WorkOrderStatusHistoryDto fromEntity(WorkOrderStatusHistory history) {
        if (history == null) return null;
        return WorkOrderStatusHistoryDto.builder()
                .id(history.getId())
                .workOrderId(history.getWorkOrder() != null ? history.getWorkOrder().getId() : null)
                .fromStatus(history.getFromStatus())
                .toStatus(history.getToStatus())
                .changedByUserId(history.getChangedByUser() != null ? history.getChangedByUser().getId() : null)
                .changedByUserName(history.getChangedByUser() != null ? history.getChangedByUser().getName() : "System")
                .changedAt(history.getChangedAt())
                .note(history.getNote())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(String workOrderId) { this.workOrderId = workOrderId; }

    public WorkOrderStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(WorkOrderStatus fromStatus) { this.fromStatus = fromStatus; }

    public WorkOrderStatus getToStatus() { return toStatus; }
    public void setToStatus(WorkOrderStatus toStatus) { this.toStatus = toStatus; }

    public String getChangedByUserId() { return changedByUserId; }
    public void setChangedByUserId(String changedByUserId) { this.changedByUserId = changedByUserId; }

    public String getChangedByUserName() { return changedByUserName; }
    public void setChangedByUserName(String changedByUserName) { this.changedByUserName = changedByUserName; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
