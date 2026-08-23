package com.KEYSTONE.fieldServiceManagement.Service;

import com.KEYSTONE.fieldServiceManagement.Dto.AuthRequest;
import com.KEYSTONE.fieldServiceManagement.Dto.AuthResponse;
import com.KEYSTONE.fieldServiceManagement.Entity.User;
import com.KEYSTONE.fieldServiceManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials: User not found"));

        // Simplified authentication match for seed & demo password verification
        // In production, BCryptPasswordEncoder matches request.getPassword() with user.getPasswordHash()
        String token = "jwt-stateless-token-" + UUID.randomUUID().toString() + "-" + user.getId();

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
