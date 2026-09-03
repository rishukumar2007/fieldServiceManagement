package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
