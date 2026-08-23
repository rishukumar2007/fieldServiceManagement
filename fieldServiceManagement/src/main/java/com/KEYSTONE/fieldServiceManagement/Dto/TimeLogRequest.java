package com.KEYSTONE.fieldServiceManagement.Dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeLogRequest {
    private Integer minutes;
    private String note;
}
