package com.KEYSTONE.fieldServiceManagement.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignWorkOrderRequest {

    @NotBlank(message = "Technician ID is required")
    private String technicianId;
    private String note;

    public AssignWorkOrderRequest() {
    }

    public AssignWorkOrderRequest(String technicianId) {
        this.technicianId = technicianId;
    }

    public AssignWorkOrderRequest(String technicianId, String note) {
        this.technicianId = technicianId;
        this.note = note;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String technicianId;
        private String note;

        public Builder technicianId(String technicianId) { this.technicianId = technicianId; return this; }
        public Builder note(String note) { this.note = note; return this; }

        public AssignWorkOrderRequest build() {
            return new AssignWorkOrderRequest(technicianId, note);
        }
    }

    public String getTechnicianId() { return technicianId; }
    public void setTechnicianId(String technicianId) { this.technicianId = technicianId; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
