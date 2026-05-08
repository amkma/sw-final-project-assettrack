package com.assettrack.sw_final_project_assettrack.controller;

import com.assettrack.sw_final_project_assettrack.dto.request.UserLoginRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserRegisterRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserUpdateRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.UserResponse;
import com.assettrack.sw_final_project_assettrack.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Register a new user with email and password.
     * Creates a new user account with default role USER.
     * Returns the created user response.
     */
    @PostMapping("/auth/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegisterRequest req) {
        UserResponse response = userService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate user with email and password.
     * Returns a JWT access token valid for 1 hour on successful authentication.
     * Throws exception on invalid credentials.
     */
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginRequest req) {
        String token = userService.login(req);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve a user by ID.
     * Admin-only operation. Returns user details without email and password.
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        UserResponse response = userService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * List all users with a specific role.
     * Admin-only operation. Query parameter: role (0=USER, 1=MANAGER, 2=ADMIN).
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> listByRole(@RequestParam long role) {
        List<UserResponse> users = userService.listByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
     * Update user details (firstName, lastName, email, password, role).
     * Admin-only operation. Only admins can modify user information.
     */
    @PutMapping("/users")
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserUpdateRequest req) {
        UserResponse response = userService.updateUser(req);
        return ResponseEntity.ok(response);
    }

    /**
     * Change the role of a user.
     * Admin-only operation. Updates the roleId for the specified user.
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserResponse> changeRole(@PathVariable Long userId, @RequestParam Long newRoleId) {
        UserResponse response = userService.changeRole(userId, newRoleId);
        return ResponseEntity.ok(response);
    }

}
