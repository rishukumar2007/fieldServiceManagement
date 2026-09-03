package com.KEYSTONE.fieldServiceManagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignWorkOrderRequest {
    @NotBlank(message = "Technician ID is required")
    private String technicianId;

    private String note;
}
