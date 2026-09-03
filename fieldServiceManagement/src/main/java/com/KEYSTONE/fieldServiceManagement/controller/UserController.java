package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.TechnicianPerformanceDto;
import com.KEYSTONE.fieldServiceManagement.dto.UserDto;
import com.KEYSTONE.fieldServiceManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/api/users", "/users"})
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping({"/api/users/{id}", "/users/{id}"})
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping({"/api/technicians", "/technicians"})
    public ResponseEntity<List<TechnicianPerformanceDto>> getTechnicians() {
        List<TechnicianPerformanceDto> performance = userService.getTechnicianPerformance();
        return ResponseEntity.ok(performance);
    }
}
