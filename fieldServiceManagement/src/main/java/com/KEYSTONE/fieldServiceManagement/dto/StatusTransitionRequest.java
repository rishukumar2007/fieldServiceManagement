package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.WorkOrderStatus;
import jakarta.validation.constraints.NotNull;

public class StatusTransitionRequest {
    @NotNull(message = "Target status is required")
    private WorkOrderStatus status;

    private String note;

    public StatusTransitionRequest() {
    }

    public StatusTransitionRequest(WorkOrderStatus status, String note) {
        this.status = status;
        this.note = note;
    }

    public WorkOrderStatus getStatus() { return status; }
    public void setStatus(WorkOrderStatus status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
