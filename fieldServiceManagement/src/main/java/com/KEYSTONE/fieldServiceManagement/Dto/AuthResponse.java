package com.KEYSTONE.fieldServiceManagement.Dto;

import com.KEYSTONE.fieldServiceManagement.Enum.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
}
