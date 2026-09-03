package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Role;

public class OAuthLoginRequest {
    private String provider;
    private String email;
    private String name;
    private String avatarUrl;
    private Role role;

    public OAuthLoginRequest() {
    }

    public OAuthLoginRequest(String provider, String email, String name, String avatarUrl, Role role) {
        this.provider = provider;
        this.email = email;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.role = role;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String provider;
        private String email;
        private String name;
        private String avatarUrl;
        private Role role;

        public Builder provider(String provider) { this.provider = provider; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder role(Role role) { this.role = role; return this; }

        public OAuthLoginRequest build() {
            return new OAuthLoginRequest(provider, email, name, avatarUrl, role);
        }
    }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
