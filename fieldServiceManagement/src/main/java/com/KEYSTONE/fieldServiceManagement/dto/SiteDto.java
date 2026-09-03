package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Site;

public class SiteDto {
    private String id;
    private String customerId;
    private String customerName;
    private String name;
    private String address;

    public SiteDto() {
    }

    public SiteDto(String id, String customerId, String customerName, String name, String address) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.name = name;
        this.address = address;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String customerId;
        private String customerName;
        private String name;
        private String address;

        public Builder id(String id) { this.id = id; return this; }
        public Builder customerId(String customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder address(String address) { this.address = address; return this; }

        public SiteDto build() {
            return new SiteDto(id, customerId, customerName, name, address);
        }
    }

    public static SiteDto fromEntity(Site site) {
        if (site == null) return null;
        return SiteDto.builder()
                .id(site.getId())
                .customerId(site.getCustomer() != null ? site.getCustomer().getId() : null)
                .customerName(site.getCustomer() != null ? site.getCustomer().getName() : null)
                .name(site.getName())
                .address(site.getAddress())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
