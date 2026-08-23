package com.KEYSTONE.fieldServiceManagement.Dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignWorkOrderRequest {
    private Long technicianId;
    private String note;
}
