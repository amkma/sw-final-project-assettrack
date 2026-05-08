package com.assettrack.sw_final_project_assettrack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

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
}
