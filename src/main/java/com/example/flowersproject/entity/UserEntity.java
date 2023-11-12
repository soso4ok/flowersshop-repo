package com.example.flowersproject.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table("users")
public class UserEntity {
    @Id
    private Long id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private UserRole role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ToString.Include(name = "password")
    private String maskPassword() {
        return "********";
    }

}
