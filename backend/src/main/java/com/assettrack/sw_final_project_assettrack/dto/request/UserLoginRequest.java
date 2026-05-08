package com.assettrack.sw_final_project_assettrack.dto.request;



import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserLoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

}

