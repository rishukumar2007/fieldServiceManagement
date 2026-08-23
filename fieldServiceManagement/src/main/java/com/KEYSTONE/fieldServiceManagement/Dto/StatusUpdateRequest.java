package com.KEYSTONE.fieldServiceManagement.Dto;

import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusUpdateRequest {
    private WorkOrderStatus status;
    private String note;
}
