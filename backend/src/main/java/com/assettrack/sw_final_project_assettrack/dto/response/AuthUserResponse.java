package com.assettrack.sw_final_project_assettrack.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthUserResponse {

    private Long id;

    private String email;

    private String role;
}
