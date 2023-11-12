package com.example.flowersproject.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserDto {
    private Long id;
    private String username;
    @JsonProperty(access =  JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String firstName;
    private String lastName;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
