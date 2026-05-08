package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.UserLoginRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserRegisterRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserUpdateRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AuthResponse;
import com.assettrack.sw_final_project_assettrack.dto.response.UserResponse;
import com.assettrack.sw_final_project_assettrack.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        UserResponse response = userService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserResponse>> listByRole(@RequestParam long role) {
        List<UserResponse> users = userService.listByRole(role);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or #request.id == principal.id")
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUser(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> changeRole(@PathVariable Long userId, @RequestParam Long newRoleId) {
        UserResponse response = userService.changeRole(userId, newRoleId);
        return ResponseEntity.ok(response);
    }
}
