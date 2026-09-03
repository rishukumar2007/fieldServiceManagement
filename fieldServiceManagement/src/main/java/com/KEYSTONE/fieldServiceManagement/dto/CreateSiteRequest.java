package com.KEYSTONE.fieldServiceManagement.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSiteRequest {
    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotBlank(message = "Site name is required")
    private String name;

    @NotBlank(message = "Site address is required")
    private String address;

    public CreateSiteRequest() {
    }

    public CreateSiteRequest(String customerId, String name, String address) {
        this.customerId = customerId;
        this.name = name;
        this.address = address;
    }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
