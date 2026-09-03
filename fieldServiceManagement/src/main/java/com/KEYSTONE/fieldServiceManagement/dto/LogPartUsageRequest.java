package com.KEYSTONE.fieldServiceManagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LogPartUsageRequest {
    @NotBlank(message = "Part ID is required")
    private String partId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public LogPartUsageRequest() {
    }

    public LogPartUsageRequest(String partId, Integer quantity) {
        this.partId = partId;
        this.quantity = quantity;
    }

    public String getPartId() { return partId; }
    public void setPartId(String partId) { this.partId = partId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
