package com.assettrack.sw_final_project_assettrack.dto.request;

import lombok.*;
import jakarta.validation.constraints.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    @NotNull(message = "User ID is required")
    private Long id;

    private String firstName;

    private String lastName;

    @Email
    private String email;

    private String password;
    @NotNull(message = "role is required")
    private Long roleId;//0 user 1 manager 2 admin
}
