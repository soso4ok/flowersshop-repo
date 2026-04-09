package com.example.flowersproject.dto;

public record AdminUserDTO(
        Integer id,
        String firstname,
        String lastname,
        String email,
        String role,
        Boolean enabled) {
}
