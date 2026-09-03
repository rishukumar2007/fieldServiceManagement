package com.KEYSTONE.fieldServiceManagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PartUsageRequest {

    @NotBlank(message = "Part ID is required")
    private String partId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public PartUsageRequest() {
    }

    public PartUsageRequest(String partId, Integer quantity) {
        this.partId = partId;
        this.quantity = quantity;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String partId;
        private Integer quantity;

        public Builder partId(String partId) { this.partId = partId; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }

        public PartUsageRequest build() {
            return new PartUsageRequest(partId, quantity);
        }
    }

    public String getPartId() { return partId; }
    public void setPartId(String partId) { this.partId = partId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
