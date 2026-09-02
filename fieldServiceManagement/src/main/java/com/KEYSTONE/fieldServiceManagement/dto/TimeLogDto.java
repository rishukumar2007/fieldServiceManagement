package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.TimeLog;
import java.time.LocalDateTime;

public class TimeLogDto {
    private String id;
    private String workOrderId;
    private String technicianId;
    private String technicianName;
    private Integer minutes;
    private String note;
    private LocalDateTime createdAt;

    public TimeLogDto() {
    }

    public TimeLogDto(String id, String workOrderId, String technicianId, String technicianName,
                      Integer minutes, String note, LocalDateTime createdAt) {
        this.id = id;
        this.workOrderId = workOrderId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.minutes = minutes;
        this.note = note;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String workOrderId;
        private String technicianId;
        private String technicianName;
        private Integer minutes;
        private String note;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder workOrderId(String workOrderId) { this.workOrderId = workOrderId; return this; }
        public Builder technicianId(String technicianId) { this.technicianId = technicianId; return this; }
        public Builder technicianName(String technicianName) { this.technicianName = technicianName; return this; }
        public Builder minutes(Integer minutes) { this.minutes = minutes; return this; }
        public Builder note(String note) { this.note = note; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TimeLogDto build() {
            return new TimeLogDto(id, workOrderId, technicianId, technicianName, minutes, note, createdAt);
        }
    }

    public static TimeLogDto fromEntity(TimeLog log) {
        if (log == null) return null;
        return TimeLogDto.builder()
                .id(log.getId())
                .workOrderId(log.getWorkOrder() != null ? log.getWorkOrder().getId() : null)
                .technicianId(log.getTechnician() != null ? log.getTechnician().getId() : null)
                .technicianName(log.getTechnician() != null ? log.getTechnician().getName() : "Technician")
                .minutes(log.getMinutes())
                .note(log.getNote())
                .createdAt(log.getCreatedAt())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(String workOrderId) { this.workOrderId = workOrderId; }

    public String getTechnicianId() { return technicianId; }
    public void setTechnicianId(String technicianId) { this.technicianId = technicianId; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public Integer getMinutes() { return minutes; }
    public void setMinutes(Integer minutes) { this.minutes = minutes; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
