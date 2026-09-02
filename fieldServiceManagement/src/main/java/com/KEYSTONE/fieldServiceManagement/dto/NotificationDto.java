package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.NotificationItem;
import java.time.LocalDateTime;

public class NotificationDto {
    private String id;
    private String title;
    private String message;
    private String type;
    private LocalDateTime timestamp;
    private boolean read;
    private String workOrderId;

    public NotificationDto() {
    }

    public NotificationDto(String id, String title, String message, String type,
                           LocalDateTime timestamp, boolean read, String workOrderId) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.timestamp = timestamp;
        this.read = read;
        this.workOrderId = workOrderId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private String message;
        private String type;
        private LocalDateTime timestamp;
        private boolean read;
        private String workOrderId;

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public Builder read(boolean read) { this.read = read; return this; }
        public Builder workOrderId(String workOrderId) { this.workOrderId = workOrderId; return this; }

        public NotificationDto build() {
            return new NotificationDto(id, title, message, type, timestamp, read, workOrderId);
        }
    }

    public static NotificationDto fromEntity(NotificationItem notif) {
        if (notif == null) return null;
        return NotificationDto.builder()
                .id(notif.getId())
                .title(notif.getTitle())
                .message(notif.getMessage())
                .type(notif.getType() != null ? notif.getType().getValue() : "status_change")
                .timestamp(notif.getTimestamp())
                .read(notif.isRead())
                .workOrderId(notif.getWorkOrderId())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(String workOrderId) { this.workOrderId = workOrderId; }
}
