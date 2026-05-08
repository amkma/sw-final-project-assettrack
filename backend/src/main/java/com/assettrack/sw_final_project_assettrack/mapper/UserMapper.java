
package com.assettrack.sw_final_project_assettrack.mapper;

import com.assettrack.sw_final_project_assettrack.dto.request.UserRegisterRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserUpdateRequest;

import com.assettrack.sw_final_project_assettrack.dto.response.UserResponse;
import com.assettrack.sw_final_project_assettrack.entity.User;
import org.springframework.stereotype.Component;;

@Component
public class UserMapper {

 
    public User toEntity(UserRegisterRequest request) {
        if (request == null) return null;

        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword()) 
                .roleId(0L) // Defaulting to User
                .build();
    }

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(mapRoleIdToString(user.getRoleId()))
                .build();
    }

    public void updateEntityFromRequest(UserUpdateRequest request, User user) {
        if (request == null || user == null) return;

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null) user.setPassword(request.getPassword());
        if (request.getRoleId() != null) user.setRoleId(request.getRoleId());
    }

    
    private String mapRoleIdToString(long roleId) {
        if (roleId == 1) return "MANAGER";
        if (roleId == 2) return "ADMIN";
        return "USER"; // Default/0
    }
}
