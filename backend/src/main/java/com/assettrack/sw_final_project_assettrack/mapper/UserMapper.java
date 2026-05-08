
package com.assettrack.sw_final_project_assettrack.mapper;

import com.assettrack.sw_final_project_assettrack.dto.request.UserRegisterRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserUpdateRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AuthResponse;
import com.assettrack.sw_final_project_assettrack.dto.response.AuthUserResponse;
import com.assettrack.sw_final_project_assettrack.dto.response.UserResponse;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.security.AppRole;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRegisterRequest request) {
        if (request == null) return null;

        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .roleId(AppRole.USER.getId())
                .build();
    }

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(AppRole.fromId(user.getRoleId()).name())
                .build();
    }

    public AuthUserResponse toAuthUserResponse(User user) {
        if (user == null) return null;

        return AuthUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(AppRole.fromId(user.getRoleId()).name())
                .build();
    }

    public AuthResponse toAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .user(toAuthUserResponse(user))
                .build();
    }

    public void updateEntityFromRequest(UserUpdateRequest request, User user) {
        if (request == null || user == null) return;

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
    }
}
