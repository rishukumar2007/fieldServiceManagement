package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private WorkOrderStatus status;
    private String note;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(WorkOrderStatus status, String note) {
        this.status = status;
        this.note = note;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private WorkOrderStatus status;
        private String note;

        public Builder status(WorkOrderStatus status) { this.status = status; return this; }
        public Builder note(String note) { this.note = note; return this; }

        public StatusUpdateRequest build() {
            return new StatusUpdateRequest(status, note);
        }
    }

    public WorkOrderStatus getStatus() { return status; }
    public void setStatus(WorkOrderStatus status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
