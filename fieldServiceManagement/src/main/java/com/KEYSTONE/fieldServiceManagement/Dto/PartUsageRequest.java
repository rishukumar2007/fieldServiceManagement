package com.KEYSTONE.fieldServiceManagement.Dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartUsageRequest {
    private Long partId;
    private Integer quantity;
}
