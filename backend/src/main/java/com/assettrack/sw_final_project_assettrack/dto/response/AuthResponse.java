package com.assettrack.sw_final_project_assettrack.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private AuthUserResponse user;
}
