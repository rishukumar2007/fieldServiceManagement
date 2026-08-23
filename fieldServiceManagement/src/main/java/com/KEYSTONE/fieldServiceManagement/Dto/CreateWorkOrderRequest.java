package com.KEYSTONE.fieldServiceManagement.Dto;

import com.KEYSTONE.fieldServiceManagement.Enum.Priority;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateWorkOrderRequest {
    private String title;
    private String description;
    private Priority priority;
    private Long customerId;
    private Long siteId;
}
