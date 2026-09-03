package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.LoginRequest;
import com.KEYSTONE.fieldServiceManagement.dto.LoginResponse;
import com.KEYSTONE.fieldServiceManagement.dto.OAuthLoginRequest;
import com.KEYSTONE.fieldServiceManagement.dto.UserDto;
import com.KEYSTONE.fieldServiceManagement.model.Role;
import com.KEYSTONE.fieldServiceManagement.model.User;
import com.KEYSTONE.fieldServiceManagement.repository.UserRepository;
import com.KEYSTONE.fieldServiceManagement.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + request.getEmail()));

        String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId(), user.getName());

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return new LoginResponse(jwt, "Bearer", userDto);
    }

    @Transactional
    public LoginResponse oauthLogin(OAuthLoginRequest request) {
        String email = request.getEmail().toLowerCase();
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            String name = request.getName();
            if (name == null || name.isBlank()) {
                name = email.split("@")[0];
            }
            Role role = request.getRole() != null ? request.getRole() : Role.MANAGER;
            User newUser = User.builder()
                    .id("usr-" + System.currentTimeMillis())
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("oauth-dummy-password"))
                    .role(role)
                    .avatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80")
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(newUser);
        });

        String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId(), user.getName());

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return new LoginResponse(jwt, "Bearer", userDto);
    }
}
