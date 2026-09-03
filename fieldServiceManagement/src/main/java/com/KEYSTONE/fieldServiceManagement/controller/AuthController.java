package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.LoginRequest;
import com.KEYSTONE.fieldServiceManagement.dto.LoginResponse;
import com.KEYSTONE.fieldServiceManagement.dto.OAuthLoginRequest;
import com.KEYSTONE.fieldServiceManagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth")
    public ResponseEntity<LoginResponse> oauthLogin(@Valid @RequestBody OAuthLoginRequest request) {
        LoginResponse response = authService.oauthLogin(request);
        return ResponseEntity.ok(response);
    }
}
