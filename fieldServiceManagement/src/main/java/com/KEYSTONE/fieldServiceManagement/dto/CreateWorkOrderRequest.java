package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateWorkOrderRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotBlank(message = "Site ID is required")
    private String siteId;

    public CreateWorkOrderRequest() {
    }

    public CreateWorkOrderRequest(String title, String description, Priority priority, String customerId, String siteId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.customerId = customerId;
        this.siteId = siteId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private Priority priority;
        private String customerId;
        private String siteId;

        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder priority(Priority priority) { this.priority = priority; return this; }
        public Builder customerId(String customerId) { this.customerId = customerId; return this; }
        public Builder siteId(String siteId) { this.siteId = siteId; return this; }

        public CreateWorkOrderRequest build() {
            return new CreateWorkOrderRequest(title, description, priority, customerId, siteId);
        }
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getSiteId() { return siteId; }
    public void setSiteId(String siteId) { this.siteId = siteId; }
}
