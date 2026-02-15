package com.example.flowersproject.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private List<ProductDTO> products;
}
