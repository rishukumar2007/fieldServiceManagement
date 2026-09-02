package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String userId;
    private String name;
    private String email;
    private Role role;
    private UserDto user;

    public AuthResponse() {
    }

    public AuthResponse(String token, String type, String userId, String name, String email, Role role, UserDto user) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String type = "Bearer";
        private String userId;
        private String name;
        private String email;
        private Role role;
        private UserDto user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, type, userId, name, email, role, user);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
