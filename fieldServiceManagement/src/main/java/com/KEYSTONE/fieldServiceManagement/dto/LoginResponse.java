package com.KEYSTONE.fieldServiceManagement.dto;

public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;

    public LoginResponse() {
    }

    public LoginResponse(String token, String type, UserDto user) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String type = "Bearer";
        private UserDto user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, type, user);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
