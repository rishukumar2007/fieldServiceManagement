package com.KEYSTONE.fieldServiceManagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class TimeLogRequest {

    @NotNull(message = "Minutes is required")
    @Min(value = 1, message = "Minutes must be at least 1")
    private Integer minutes;

    private String note;

    public TimeLogRequest() {
    }

    public TimeLogRequest(Integer minutes, String note) {
        this.minutes = minutes;
        this.note = note;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Integer minutes;
        private String note;

        public Builder minutes(Integer minutes) { this.minutes = minutes; return this; }
        public Builder note(String note) { this.note = note; return this; }

        public TimeLogRequest build() {
            return new TimeLogRequest(minutes, note);
        }
    }

    public Integer getMinutes() { return minutes; }
    public void setMinutes(Integer minutes) { this.minutes = minutes; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
