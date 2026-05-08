package com.assettrack.sw_final_project_assettrack.dto.response;
import lombok.*;


// the data coming from repository
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

  
    private Long id;

    private String firstName;

    private String lastName;

    private String role;
}
