package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Customer;

public class CustomerDto {
    private String id;
    private String name;
    private String contactEmail;
    private String contactPhone;
    private int sitesCount;

    public CustomerDto() {
    }

    public CustomerDto(String id, String name, String contactEmail, String contactPhone, int sitesCount) {
        this.id = id;
        this.name = name;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.sitesCount = sitesCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String contactEmail;
        private String contactPhone;
        private int sitesCount;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder contactEmail(String contactEmail) { this.contactEmail = contactEmail; return this; }
        public Builder contactPhone(String contactPhone) { this.contactPhone = contactPhone; return this; }
        public Builder sitesCount(int sitesCount) { this.sitesCount = sitesCount; return this; }

        public CustomerDto build() {
            return new CustomerDto(id, name, contactEmail, contactPhone, sitesCount);
        }
    }

    public static CustomerDto fromEntity(Customer customer) {
        if (customer == null) return null;
        return CustomerDto.builder()
                .id(customer.getId())
                .name(customer.getName())
                .contactEmail(customer.getContactEmail())
                .contactPhone(customer.getContactPhone())
                .sitesCount(customer.getSitesCount())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public int getSitesCount() { return sitesCount; }
    public void setSitesCount(int sitesCount) { this.sitesCount = sitesCount; }
}
