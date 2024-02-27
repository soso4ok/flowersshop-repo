package com.example.flowersproject.entity.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private UserDTO user;
    private List<ProductDTO> products;
}
