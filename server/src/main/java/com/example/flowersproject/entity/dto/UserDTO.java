package com.example.flowersproject.entity.dto;

import com.example.flowersproject.entity.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private UserRole role;

}
